import mongoose from "mongoose";
import { Auction } from "../models/Auction.model";
import { Inventory } from "../models/Inventory.model";
import { Bid } from "../models/Bid.model";
import { createDealService } from "./deal.service";
import logger from "../utils/logger";
import { CustomError, ErrorCode, HTTP_STATUS } from "../utils";
import * as NotificationEvents from "../notifications/events";

export type BidAction = "ACCEPT" | "REJECT" | "EXPIRE";

interface CreateBidInput {
  auctionId: string;
  buyerId: string;
  bidAmount: number;
}

export const createBidService = async ({
  auctionId,
  buyerId,
  bidAmount,
}: CreateBidInput) => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    // AFTER
const auction = await Auction.findById(auctionId).session(session);
if (!auction) throw new Error("Auction not found");

// 1. Ownership check first
if (auction.sellerId.toString() === buyerId)
  throw new Error("You cannot bid on your own auction");

// 2. Auto-activate if upcoming and within date range
const now = new Date();
if (
  auction.status === "upcoming" &&
  now >= auction.startDate &&
  now <= auction.endDate
) {
  auction.status = "active";
  await auction.save({ session });
}

// 3. Status check after auto-activation
if (auction.status !== "active")
  throw new Error("Auction is not active");

if (now < auction.startDate)
  throw new Error("Auction has not started yet");
if (now > auction.endDate)
  throw new Error("Auction has ended");

      if (auction.highestBidderId?.toString() === buyerId)
        throw new CustomError("You already have the highest bid", HTTP_STATUS.BAD_REQUEST, ErrorCode.ALREADY_HIGHEST_BIDDER);

      const currentPrice = auction.currentBid ?? auction.basePrice;
      if (bidAmount <= currentPrice)
        throw new CustomError(`Bid must be higher than ${currentPrice}`, HTTP_STATUS.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);

      // 🏁 Satisfy unique index: Cancel previous active bids from this user
      await Bid.updateMany(
        { auctionId, buyerId, status: "ACTIVE" },
        { $set: { status: "REJECTED" } },
        { session }
      );

      // Create bid temporarily not highest
      const [bid] = await Bid.create(
        [
          {
            auctionId,
            buyerId,
            bidAmount,
            status: "ACTIVE",
            isHighestBid: false,
          },
        ],
        { session }
      );

      // Atomic auction update (race protection)
      const updatedAuction = await Auction.findOneAndUpdate(
        {
          _id: auction._id,
          currentBid: currentPrice,
        },
        {
          $set: {
            currentBid: bidAmount,
            highestBidId: bid._id,
            highestBidderId: buyerId,
          },
          $push: { bidIds: bid._id },
        },
        { new: true, session }
      );

      if (!updatedAuction) {
        await session.abortTransaction();
        session.endSession();
        attempt++;
        // 🏁 Add small random delay (backoff) to prevent repeat collisions
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 * attempt));
        continue;
      }

      // Demote previous highest (DO NOT reject them)
      await Bid.updateMany(
        {
          auctionId,
          _id: { $ne: bid._id },
          isHighestBid: true,
          status: "ACTIVE",
        },
        { $set: { isHighestBid: false } },
        { session }
      );

      // Promote current bid
      bid.isHighestBid = true;
      await bid.save({ session });

      await session.commitTransaction();
      session.endSession();

      logger.info("Bid created", { bidId: bid._id, auctionId, buyerId, bidAmount });

      // ================================
      // 🔥 NOTIFICATIONS
      // ================================
      const inventory = await Inventory.findById(auction.inventoryId).select("title").lean();
      const diamondName = inventory?.title || "Diamond";

      // 1. Notify Seller
      NotificationEvents.notifyNewBid(auction.sellerId.toString(), bidAmount, diamondName);

      // 2. Notify Previous Highest Bidder (Outbid)
      if (auction.highestBidderId && auction.highestBidderId.toString() !== buyerId) {
        NotificationEvents.notifyOutbid(auction.highestBidderId.toString(), diamondName);
      }

      return bid;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        error.code === 11000 || // unique index
        error.message.includes("Duplicate")
      ) {
        attempt++;
        continue;
      }

      throw error;
    }
  }

  throw new CustomError(
    "Bid conflict persisted. Please check latest bid and try again.",
    HTTP_STATUS.CONFLICT,
    ErrorCode.BID_CONFLICT
  );
};

export const updateBidStatusService = async (
  bidId: string,
  action: BidAction,
  userId: string,
  userRole: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) throw new CustomError("Bid not found", HTTP_STATUS.NOT_FOUND, ErrorCode.NOT_FOUND);

    if (bid.status !== "ACTIVE")
      throw new CustomError("Only active bids can be updated", HTTP_STATUS.BAD_REQUEST, ErrorCode.BID_NOT_ACTIVE);

    const auction = await Auction.findById(bid.auctionId).session(session);
    if (!auction) throw new CustomError("Auction not found", HTTP_STATUS.NOT_FOUND, ErrorCode.NOT_FOUND);

    const isOwner = auction.sellerId.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin)
      throw new CustomError("Access denied", HTTP_STATUS.FORBIDDEN, ErrorCode.FORBIDDEN);

    let deal: any = null;

    switch (action) {
      case "ACCEPT": {
        if (auction.status !== "active")
          throw new CustomError("Auction is not active", HTTP_STATUS.BAD_REQUEST, ErrorCode.AUCTION_NOT_ACTIVE);

        // Reject all other active bids
        await Bid.updateMany(
          {
            auctionId: auction._id,
            _id: { $ne: bid._id },
            status: "ACTIVE",
          },
          { $set: { status: "REJECTED", isHighestBid: false } },
          { session }
        );

        // Accept selected bid (KEEP highest true)
        bid.status = "ACCEPTED";
        bid.isHighestBid = true;
        await bid.save({ session });

        // End auction
        auction.status = "ended";
        auction.locked = true;
        auction.endedAt = new Date();
        auction.highestBidId = bid._id;
        auction.highestBidderId = bid.buyerId;
        auction.currentBid = bid.bidAmount;
        await auction.save({ session });

        const inventory = await Inventory.findById(auction.inventoryId).session(session);
        if (!inventory) throw new CustomError("Inventory not found", HTTP_STATUS.NOT_FOUND, ErrorCode.NOT_FOUND);

        inventory.status = "on_memo";
        inventory.locked = true;
        inventory.price = bid.bidAmount;
        await inventory.save({ session });

        deal = await createDealService(
          bid._id.toString(),
          auction.sellerId.toString(),
          session
        );

        break;
      }

      case "REJECT":
      case "EXPIRE": {
        const wasHighest = bid.isHighestBid;

        bid.status = action === "REJECT" ? "REJECTED" : "EXPIRED";
        bid.isHighestBid = false;
        await bid.save({ session });

        if (wasHighest) {
          const newHighest = await Bid.findOne({
            auctionId: auction._id,
            status: "ACTIVE",
          })
            .sort({ bidAmount: -1, createdAt: -1 })
            .session(session);

          if (newHighest) {
            newHighest.isHighestBid = true;
            await newHighest.save({ session });

            auction.highestBidId = newHighest._id;
            auction.highestBidderId = newHighest.buyerId;
            auction.currentBid = newHighest.bidAmount;
          } else {
            auction.highestBidId = undefined;
            auction.highestBidderId = undefined;
            auction.currentBid = auction.basePrice;
          }

          await auction.save({ session });
        }

        break;
      }

      default:
        throw new CustomError("Invalid bid action", HTTP_STATUS.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
    }

    await session.commitTransaction();
    session.endSession();

    logger.info("Bid status updated", { bidId, action, userId });
    return { bid, deal };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getBidsByAuctionService = async (auctionId: string) => {
  return Bid.find({ auctionId })
    .populate("buyerId", "name email")
    .sort({ bidAmount: -1, createdAt: -1 });
};

export const getHighestBidByAuctionService = async (auctionId: string) => {
  return Bid.findOne({
    auctionId,
    status : {$in : ["ACTIVE" , "ACCEPTED"]},
  })
    .sort({bidAmount : -1})
    .populate("buyerId", "name email");
};

export const getMyBidService = async (auctionId: string, buyerId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(auctionId) ||
    !mongoose.Types.ObjectId.isValid(buyerId)
  ) {
    throw new CustomError("Invalid auctionId or buyerId", HTTP_STATUS.BAD_REQUEST, ErrorCode.VALIDATION_ERROR);
  }

  return Bid.find({ auctionId, buyerId })
    .sort({ createdAt: -1 });
};

export const getMyAllBidsService = async (buyerId: string) => {
  return Bid.find({ buyerId })
    .populate({
      path: "auctionId",
      populate: [
        {
          path: "inventoryId",
          select: "title shape carat color clarity cut images price",
        },
        {
          path: "sellerId",
          select: "name email",
        },
      ],
    })
    .sort({ createdAt: -1 });
};

export const getBidsOnMyListingsService = async (sellerId: string) => {
  const auctions = await Auction.find({ 
    sellerId: new mongoose.Types.ObjectId(sellerId)  // ← explicit ObjectId cast
  }).select("_id");

  const auctionIds = auctions.map((a) => a._id);

  return Bid.find({ auctionId: { $in: auctionIds } })
    .populate({
      path: "auctionId",
      populate: {
        path: "inventoryId",
        select: "shape carat color clarity cut images price",
      },
    })
    .populate("buyerId", "name email")
    .sort({ createdAt: -1 });
};