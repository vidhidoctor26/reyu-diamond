import { memo } from "react";
import { motion } from "framer-motion";
import {
  Eye, Gavel, Diamond, MoreVertical, Pencil, Pause, Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ListingCard = ({ listing, index }: any) => {
 

    const title = `${listing.name || "Diamond"} ${listing.carat || ""}ct`;
  const specs = `${listing.color || ""} / ${listing.clarity || ""}`;
  const price = listing.price ?? listing.currentBid ?? listing.basePrice ?? 0;
  const bidsCount = listing.bids || listing.bidIds?.length || 0;
  const expires = listing.endDate
    ? new Date(listing.endDate).toLocaleDateString()
    : "-";

  const thumbnail = listing.images?.[0] || null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-yellow-500/10 text-yellow-600">Upcoming</Badge>;
      case "ended":
        return <Badge className="bg-blue-500/10 text-blue-600">Ended</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="card-premium">
        <CardContent className="p-6 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex gap-4">

            {/* ✅ Image or fallback */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-accent/10 flex items-center justify-center flex-shrink-0">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Diamond className="h-6 w-6 text-accent/70" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{title}</h3>
                {getStatusBadge(listing.status)}
              </div>

              <p className="text-sm text-muted-foreground">{specs}</p>

              <div className="flex gap-4 text-sm mt-1 text-muted-foreground">
                <span className="flex gap-1 items-center">
                  <Eye className="h-4 w-4" /> 0 views
                </span>
                <span className="flex gap-1 items-center">
                  <Gavel className="h-4 w-4" /> {bidsCount} bids
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-start gap-4">
            <div className="text-right">
              <p className="text-xl font-semibold">${price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Ends: {expires}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-muted transition">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex gap-2">
                  <Eye className="h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2">
                  <Gavel className="h-4 w-4" /> View Bids
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2">
                  <Pencil className="h-4 w-4" /> Edit Auction
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2">
                  <Pause className="h-4 w-4" /> Pause Auction
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4" /> Delete Auction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(ListingCard);