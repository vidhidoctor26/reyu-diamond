import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, XCircle, AlertCircle, Megaphone, ExternalLink } from "lucide-react";
import type { Advertisement } from "@/store/slices/advertisementSlice";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING:  { label: "Pending",  className: "bg-amber-500/10 text-amber-600 border-amber-500/20",       icon: Clock },
  APPROVED: { label: "Approved", className: "bg-blue-500/10 text-blue-600 border-blue-500/20",           icon: CheckCircle },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  DISABLED: { label: "Disabled", className: "bg-muted text-muted-foreground border-border",             icon: AlertCircle },
  DEFAULT:  { label: "Unknown",  className: "bg-muted text-muted-foreground border-border",             icon: AlertCircle },
};

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? statusConfig.DEFAULT;

interface AdViewModalProps {
  ad: Advertisement | null;
  open: boolean;
  onClose: () => void;
}

const AdViewModal = ({ ad, open, onClose }: AdViewModalProps) => {
  if (!ad) return null;

  const config     = getStatusConfig(ad.status);
  const StatusIcon = config.icon;

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-start gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Advertisement Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Media */}
          <div className="w-full h-48 rounded-xl overflow-hidden bg-muted">
            {ad.mediaUrl ? (
              ad.mediaType === "video" ? (
                <video src={ad.mediaUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <Separator />

          {/* Details */}
          <div className="divide-y divide-border/50">
            {row("Title", ad.title)}
            {ad.description && row("Description", ad.description)}
            {row(
              "Status",
              <Badge variant="outline" className={`text-[10px] font-medium ${config.className}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            )}
            {row(
              "Placement",
              <span className="flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                {ad.bannerSection?.join(", ") || "—"}
              </span>
            )}
            {ad.ctaLink && row(
              "Redirect Link",
              <a
                href={ad.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {ad.ctaLink.length > 30 ? ad.ctaLink.slice(0, 30) + "..." : ad.ctaLink}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {row(
              "Start Date",
              ad.startDate ? new Date(ad.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"
            )}
            {row(
              "End Date",
              ad.endDate ? new Date(ad.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"
            )}
            {row("Clicks", ad.clicks ?? 0)}
            {row(
              "Submitted",
              new Date(ad.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            )}
          </div>

          {/* Rejection reason */}
          {ad.status === "REJECTED" && ad.rejectionReason && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-xs font-medium text-destructive mb-0.5">Rejection Reason</p>
              <p className="text-sm text-destructive">{ad.rejectionReason}</p>
            </div>
          )}

          {ad.status === "PENDING" && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-xs text-amber-600">Your ad is under review. You'll be notified once it's approved.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdViewModal;