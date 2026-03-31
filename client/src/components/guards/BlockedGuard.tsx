import { useAppSelector } from "@/hooks/redux";
import { ShieldX } from "lucide-react";

const BlockedGuard = ({ children }: { children: React.ReactNode }) => {
  const accountStatus = useAppSelector((s) => s.auth.accountStatus);

  if (accountStatus === "SUSPENDED") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center p-8">
        <ShieldX className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-semibold text-primary">
          Account Suspended
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Your account has been blocked by an administrator. Please contact
          support for assistance.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default BlockedGuard;