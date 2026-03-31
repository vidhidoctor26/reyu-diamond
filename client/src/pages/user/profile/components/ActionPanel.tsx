import { motion } from "framer-motion";
import { Edit, Shield, CreditCard, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/types/profile";

interface ActionPanelProps {
  profile: UserProfile;
  onEdit: () => void;
}

const ActionPanel = ({ profile, onEdit }: ActionPanelProps) => {
  const navigate = useNavigate();

  if (profile.isBlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Account Suspended</p>
              <p className="text-sm text-muted-foreground">
                Your account has been restricted. Contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const actions = [];

  if (!profile.isKycVerified) {
    actions.push({
      label: "Complete KYC Verification",
      description: "Required to start trading on the platform",
      icon: Shield,
      variant: "outline" as const,
      className: "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10",
      onClick: () => navigate("/kyc"),
    });
  }

  if (profile.stripeOnboardingStatus !== "COMPLETED") {
    actions.push({
      label: "Connect Stripe",
      description: "Enable payments and payouts for your account",
      icon: CreditCard,
      variant: "outline" as const,
      className: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
      onClick: () => {},
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-primary">Actions</h2>
        <Button onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {actions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${action.className}`}
            >
              <div className="p-2 rounded-xl bg-background">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActionPanel;
