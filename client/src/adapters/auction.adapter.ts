export interface MarketplaceListing {
  id: string;
  name: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  bids: number;
  views: number;
  seller: string;
  status: string;
  locked: boolean;
  endDate?: Date;
  change: string;
  trending: boolean;
  images: string[];
}

export const auctionToMarketplace = (auction: any): MarketplaceListing => {
  const inv = auction.inventoryId || {};

  const basePrice = auction.basePrice ?? 0;
  const currentBid = auction.currentBid ?? basePrice;

  return {
    id: auction._id,

    name: inv.shape || "Diamond",
    carat: inv.carat || 0,
    color: inv.color || "-",
    clarity: inv.clarity || "-",
    cut: inv.cut || "-",

    price: currentBid > basePrice ? currentBid : basePrice,

    bids: auction.bidIds?.length || 0,
    views: 0,

    seller: auction.sellerId?.name || "Seller",

    status: auction.status?.toLowerCase() || "upcoming",
    locked: auction.locked ?? false,
    endDate: auction.endDate,

    change: "+0%",
    trending: auction.status === "active",

    images: auction.inventoryId?.images || auction.images || [],
  };
};