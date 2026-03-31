import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CreditCard } from "lucide-react";
import api from "@/lib/api";

const ConnectStripeBanner = () => {
  const handleConnect = async () => {
    try {
      // 1️⃣ Create account (safe if already exists)
      await api.post("/stripe/create-connected-account");

      // 2️⃣ Get onboarding link
      const res = await api.post("/stripe/create-onboarding-link");

      const url = res.data.data.url;

      // 3️⃣ Redirect to Stripe
      window.location.href = url;
    } catch (err) {
      console.error("Stripe connect error:", err);
    }
  };

  return (
    <Card className="border-yellow-400 bg-yellow-50">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-yellow-600" />
          <div>
            <p className="font-semibold text-sm">
              Connect Stripe to start transactions
            </p>
            <p className="text-xs text-muted-foreground">
              Required for escrow payments and payouts
            </p>
          </div>
        </div>

        <Button onClick={handleConnect} className="gap-2">
          <CreditCard className="h-4 w-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectStripeBanner;