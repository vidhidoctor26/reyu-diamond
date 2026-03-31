import { useState, useEffect } from "react";
import type { UserProfile, UserStats, ProfileLoadingState } from "@/types/profile";
import { getUserProfileAPI, updateUserProfileAPI } from "@/services/profile.service";

const defaultStats: UserStats = {
  averageRating: 0,
  completedDeals: 0,
  reputationScore: 0,
  totalShipments: 0,
  cancelledDeals: 0,
};

const normalizeUserProfile = (user: any): UserProfile => {
  const fullName = user.name ? String(user.name).trim() : "";
  const [firstName = "", ...rest] = fullName.split(" ");
  const lastName = user.lastName || rest.join(" ") || "";

  return {
    id: user._id || user.id || "",
    firstName: user.firstName || firstName || "",
    lastName: user.lastName || lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    companyName: user.companyName || "",
    companyType: user.companyType || "",
    address: user.address || "",
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    isKycVerified: Boolean(user.isKycVerified),
    isEmailVerified: Boolean(user.isEmailVerified),
    isBlocked: Boolean(user.isBlocked),
    stripeOnboardingStatus:
      user.stripeOnboardingStatus === "NOT_CREATED" || !user.stripeOnboardingStatus
        ? "NOT_STARTED"
        : user.stripeOnboardingStatus,
    chargesEnabled: Boolean(user.stripeChargesEnabled),
    payoutsEnabled: Boolean(user.stripePayoutsEnabled),
  };
};

const normalizeStats = (user: any): UserStats => {
  if (!user || !user.stats) return defaultStats;
  return {
    averageRating: Number(user.stats.averageRating || 0),
    completedDeals: Number(user.stats.completedDeals || 0),
    reputationScore: Number(user.stats.reputationScore || 0),
    totalShipments: Number(user.stats.totalShipments || 0),
    cancelledDeals: Number(user.stats.cancelDeals || 0),
  };
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [state, setState] = useState<ProfileLoadingState>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setState("loading");
    setError(null);
    try {
      const response = await getUserProfileAPI();
      const user = response.data?.data?.user;
      if (!user) throw new Error("Profile not found");
      setProfile(normalizeUserProfile(user));
      setStats(normalizeStats(user));
      setState("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load profile");
      setState("error");
    }
  };

  const updateProfile = async (payload: Partial<UserProfile>) => {
    setState("loading");
    setError(null);
    try {
      // backend currently accepts only name on update (legacy route)
      const name = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
      const requestBody: any = { name };

      const response = await updateUserProfileAPI(requestBody);
      const updatedUser =
        response.data?.data?.user || response.data?.data || response.data;
      if (!updatedUser) throw new Error("Failed to update profile");

      setProfile(normalizeUserProfile(updatedUser));
      setStats(normalizeStats(updatedUser));
      setState("success");
      return updatedUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update profile");
      setState("error");
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, stats, state, error, retry: fetchProfile, updateProfile };
}
