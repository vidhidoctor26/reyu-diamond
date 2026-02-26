export const resolvePermissions = (status: string | null) => ({
  canAccessDashboard:
    status === "PENDING" || status === "APPROVED",

  canTrade:
    status === "APPROVED",

  isBlocked:
    status === "NOT_STARTED" || status === "REJECTED",
});
