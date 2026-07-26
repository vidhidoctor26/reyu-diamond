import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

const StripeRefresh = () => {
  const navigate = useNavigate();

  const handleRefresh = async () => {
    try {
      // Regenerate the onboarding link
      const res = await api.post("/stripe/create-onboarding-link");
      const url = res.data.data.url;

      // Redirect back to Stripe onboarding
      window.location.href = url;
    } catch (err) {
      console.error("Stripe refresh error:", err);
      navigate("/user/deals");
    }
  };

  const handleCancel = () => {
    navigate("/user/deals");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Session Expired</CardTitle>
          <CardDescription>
            Your Stripe onboarding session has expired. Please refresh to continue the setup process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleRefresh} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh & Continue
          </Button>

          <Button onClick={handleCancel} variant="outline" className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeRefresh;