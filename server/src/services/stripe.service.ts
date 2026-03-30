// src/services/stripe.service.ts

import { stripe } from "../config/stripe";
import { User } from "../models/User.model";
import { CustomError, ErrorCode, HTTP_STATUS } from "../utils";
import logger from "../utils/logger";

// ============================
// CREATE CONNECTED ACCOUNT
// ============================
export const createStripeConnectedAccountService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError(
      "User not found",
      HTTP_STATUS.NOT_FOUND,
      ErrorCode.NOT_FOUND
    );
  }

  // 🔒 Prevent duplicate account creation
  if (user.stripeAccountId) {
    return {
      alreadyExists: true,
      accountId: user.stripeAccountId,
    };
  }

  // 🔥 Latest Stripe API structure (clover)
  const account = await stripe.accounts.create({
    country: "US",
    email: user.email,

    controller: {
      fees: { payer: "application" },
      losses: { payments: "application" },
      stripe_dashboard: { type: "express" },
    },

    capabilities: {
      transfers: { requested: true },
    },

    business_type: "individual",
  });

  user.stripeAccountId = account.id;
  user.stripeOnboardingStatus = "PENDING";

  await user.save();

  logger.info("Stripe connected account created", {
    userId,
    accountId: account.id,
  });

  return {
    alreadyExists: false,
    accountId: account.id,
  };
};

// ============================
// GENERATE ONBOARDING LINK
// ============================
export const generateOnboardingLinkService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError(
      "User not found",
      HTTP_STATUS.NOT_FOUND,
      ErrorCode.NOT_FOUND
    );
  }

  if (!user.stripeAccountId) {
    throw new CustomError(
      "Stripe account not created",
      HTTP_STATUS.BAD_REQUEST,
      ErrorCode.STRIPE_ACCOUNT_NOT_CREATED
    );
  }

  // 🚫 Prevent unnecessary regeneration
  if (user.stripeOnboardingStatus === "COMPLETED") {
    throw new CustomError(
      "Onboarding already completed",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const accountLink = await stripe.accountLinks.create({
    account: user.stripeAccountId,

    refresh_url: `${process.env.FRONTEND_URL}/stripe/refresh`,

    return_url: `${process.env.FRONTEND_URL}/stripe/success`,

    type: "account_onboarding",
  });

  logger.info("Stripe onboarding link generated", {
    userId,
    accountId: user.stripeAccountId,
  });

  return { url: accountLink.url };
};

// ============================
// CHECK STRIPE ACCOUNT STATUS
// ============================
export const checkStripeAccountStatusService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError(
      "User not found",
      HTTP_STATUS.NOT_FOUND,
      ErrorCode.NOT_FOUND
    );
  }

  if (!user.stripeAccountId) {
    throw new CustomError(
      "Stripe account not created",
      HTTP_STATUS.BAD_REQUEST,
      ErrorCode.STRIPE_ACCOUNT_NOT_CREATED
    );
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  const detailsSubmitted = account.details_submitted;
  const chargesEnabled = account.charges_enabled;
  const payoutsEnabled = account.payouts_enabled;

  // ✅ Auto-update DB if verified
  if (detailsSubmitted && chargesEnabled && payoutsEnabled) {
    if (user.stripeOnboardingStatus !== "COMPLETED") {
      user.isKycVerified = true;
      user.stripeOnboardingStatus = "COMPLETED";

      await user.save();

      logger.info("Stripe account fully verified", {
        userId,
        accountId: account.id,
      });
    }
  }

  return {
    accountId: account.id,
    detailsSubmitted,
    chargesEnabled,
    payoutsEnabled,
    requirements: account.requirements,
    stripeOnboardingStatus: user.stripeOnboardingStatus,
    isKycVerified: user.isKycVerified,
  };
};