import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStripeConnect } from "@/hooks/useStripeConnect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

const StripeSuccess = () => {
  const navigate = useNavigate();
  const { status: accountStatus, loading, refetch } = useStripeConnect();

  useEffect(() => {
    // Refetch the Stripe account status when the component mounts
    refetch();
  }, [refetch]);

  const handleContinue = () => {
    navigate("/user/deals");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Account...</h2>
            <p className="text-gray-600 text-center">
              Please wait while we verify your Stripe account setup.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isComplete = status?.chargesEnabled && status?.detailsSubmitted;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            {isComplete ? "Setup Complete!" : "Setup In Progress"}
          </CardTitle>
          <CardDescription>
            {isComplete
              ? "Your Stripe account has been successfully connected. You can now create and manage deals."
              : "Your Stripe account setup is being processed. Some information may still be required."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>Account Status:</strong> {status?.chargesEnabled ? "Active" : "Pending"}</p>
            <p><strong>Details Submitted:</strong> {status?.detailsSubmitted ? "Yes" : "No"}</p>
          </div>

          <Button onClick={handleContinue} className="w-full">
            Continue to Deals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeSuccess;