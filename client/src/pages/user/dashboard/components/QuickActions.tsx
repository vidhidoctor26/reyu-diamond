import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus, Search, Gavel, MessageSquare,
  FileText, ShieldCheck,
} from "lucide-react";
import { useAppSelector } from "@/hooks/redux";

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const kycStatus = (user as any)?.kycStatus;

  const actions = [
    {
      label: "Add Inventory",
      icon: Plus,
      onClick: () => navigate("/user/inventory/add"),
      primary: true,
    },
    {
      label: "Browse Market",
      icon: Search,
      onClick: () => navigate("/user/marketplace"),
    },
    {
      label: "My Auctions",
      icon: Gavel,
      onClick: () => navigate("/user/listings"),
    },
    {
      label: "Messages",
      icon: MessageSquare,
      onClick: () => navigate("/user/messages"),
    },
    {
      label: "My Deals",
      icon: FileText,
      onClick: () => navigate("/user/deals"),
    },
    ...(kycStatus !== "APPROVED"
      ? [
          {
            label: "Complete KYC",
            icon: ShieldCheck,
            onClick: () => navigate("/kyc/start"),
            highlight: true,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className="flex flex-wrap gap-2"
    >
      {actions.map((a) => (
        <Button
          key={a.label}
          size="sm"
          variant={a.primary ? "default" : "outline"}
          onClick={a.onClick}
          className={`gap-1.5 h-8 text-xs ${
            a.primary ? "btn-premium" : ""
          } ${
            a.highlight
              ? "border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10"
              : ""
          }`}
        >
          <a.icon className="h-3.5 w-3.5" />
          {a.label}
        </Button>
      ))}
    </motion.div>
  );
};

export default QuickActions;