import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, Edit, Trash2, MoreVertical, Megaphone,
  Image as ImageIcon, Clock, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Advertisement } from "@/store/slices/advertisementSlice";
import AdViewModal from "./AdViewModal";
import AdEditModal from "./AdEditModal";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING:  { label: "Pending",  className: "bg-amber-500/10 text-amber-600 border-amber-500/20",       icon: Clock },
  APPROVED: { label: "Approved", className: "bg-blue-500/10 text-blue-600 border-blue-500/20",           icon: CheckCircle },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  DISABLED: { label: "Disabled", className: "bg-muted text-muted-foreground border-border",             icon: AlertCircle },
  DEFAULT:  { label: "Unknown",  className: "bg-muted text-muted-foreground border-border",             icon: AlertCircle },
};

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? statusConfig.DEFAULT;

interface AdCardProps {
  ad: Advertisement;
  index: number;
}

const AdCard = ({ ad, index }: AdCardProps) => {
  const config     = getStatusConfig(ad.status);
  const StatusIcon = config.icon;
  const isExpired  = ad.endDate ? new Date(ad.endDate) < new Date() : false;

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const canEdit = ad.status === "PENDING" || ad.status === "REJECTED";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className={`border-border/50 transition-all hover:shadow-md ${
            isExpired || ad.status === "DISABLED" ? "opacity-60" : ""
          }`}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-4">
              {/* Media Preview */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                {ad.mediaUrl ? (
                  ad.mediaType === "video" ? (
                    <video src={ad.mediaUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
                  <Badge variant="outline" className={`text-[10px] font-medium ${config.className}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                  {ad.bannerSection?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Megaphone className="h-3 w-3" />
                      {ad.bannerSection.join(", ")}
                    </span>
                  )}
                  {(ad.startDate || ad.endDate) && (
                    <span>
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "—"}
                      {" — "}
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "—"}
                    </span>
                  )}
                  {ad.clicks > 0 && (
                    <span>{ad.clicks} click{ad.clicks !== 1 ? "s" : ""}</span>
                  )}
                </div>

                {ad.status === "REJECTED" && ad.rejectionReason && (
                  <p className="text-xs text-destructive mt-1.5">
                    Reason: {ad.rejectionReason}
                  </p>
                )}
                {ad.status === "PENDING" && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    Waiting for admin approval
                  </p>
                )}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </DropdownMenuItem>
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AdViewModal ad={ad} open={viewOpen} onClose={() => setViewOpen(false)} />
      <AdEditModal ad={ad} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
};

export default AdCard;