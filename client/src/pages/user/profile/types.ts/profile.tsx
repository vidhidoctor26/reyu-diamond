export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companyType: string;
  address: string;
  bio: string;
  avatarUrl?: string;
  isKycVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  stripeOnboardingStatus: "NOT_STARTED" | "PENDING" | "COMPLETED";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export interface UserStats {
  averageRating: number;
  completedDeals: number;
  reputationScore: number;
  totalShipments: number;
  cancelledDeals: number;
}

export type ProfileLoadingState = "loading" | "error" | "success";
