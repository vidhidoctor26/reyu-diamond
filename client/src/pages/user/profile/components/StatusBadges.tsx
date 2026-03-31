import { motion } from "framer-motion";
import { Shield, Mail, AlertTriangle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/profile";

interface StatusBadgesProps {
  profile: UserProfile;
}

const statusConfig = {
  kyc: {
    verified: { label: "KYC Verified", icon: Shield, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    unverified: { label: "KYC Pending", icon: Shield, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  },
  email: {
    verified: { label: "Email Verified", icon: Mail, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    unverified: { label: "Email Unverified", icon: Mail, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  },
  stripe: {
    COMPLETED: { label: "Payments Active", icon: CreditCard, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    PENDING: { label: "Stripe Pending", icon: CreditCard, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    NOT_STARTED: { label: "Connect Stripe", icon: CreditCard, className: "bg-muted text-muted-foreground border-border" },
  },
};

const StatusBadges = ({ profile }: StatusBadgesProps) => {
  const kyc = profile.isKycVerified ? statusConfig.kyc.verified : statusConfig.kyc.unverified;
  const email = profile.isEmailVerified ? statusConfig.email.verified : statusConfig.email.unverified;
  const stripe = statusConfig.stripe[profile.stripeOnboardingStatus];

  const badges = [
    { ...kyc, key: "kyc" },
    { ...email, key: "email" },
    { ...stripe, key: "stripe" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap gap-2"
    >
      {profile.isBlocked && (
        <Badge className="bg-destructive/10 text-destructive border border-destructive/20 gap-1.5 py-1 px-3">
          <AlertTriangle className="h-3.5 w-3.5" />
          Account Suspended
        </Badge>
      )}
      {badges.map((badge) => (
        <Badge
          key={badge.key}
          className={`gap-1.5 py-1 px-3 border ${badge.className}`}
        >
          <badge.icon className="h-3.5 w-3.5" />
          {badge.label}
        </Badge>
      ))}
    </motion.div>
  );
};

export default StatusBadges;
