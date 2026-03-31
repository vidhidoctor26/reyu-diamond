import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileErrorProps {
  onRetry: () => void;
}

const ProfileError = ({ onRetry }: ProfileErrorProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="p-4 rounded-2xl bg-destructive/10 mb-4">
      <AlertTriangle className="h-8 w-8 text-destructive" />
    </div>
    <h2 className="font-display text-xl font-semibold text-primary mb-2">
      Failed to load profile
    </h2>
    <p className="text-muted-foreground mb-6 max-w-sm">
      Something went wrong while fetching your profile. Please try again.
    </p>
    <Button onClick={onRetry} variant="outline" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  </div>
);

export default ProfileError;
