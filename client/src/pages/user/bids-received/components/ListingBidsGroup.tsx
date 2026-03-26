import { Card, CardContent } from "@/components/ui/card";
import { Diamond, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BidRow from "./BidRow";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ListingBidsGroup = ({ listing, ...actions }: any) => {
  const navigate = useNavigate();

  const highestBid = Math.max(...listing.bids.map((b: any) => b.bidAmount));
  const pendingCount = listing.bids.filter(
    (b: any) => b.status === "pending",
  ).length;

  return (
    <Card className="card-premium overflow-hidden">
      <CardContent className="p-6 space-y-5">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Diamond className="h-6 w-6 text-accent/70" />
            </div>

            <div>
              <p className="font-semibold text-lg">{listing.listingName}</p>
              <p className="text-sm text-muted-foreground">{listing.specs}</p>
            </div>
          </div>

          <Badge
            className={
              listing.inventoryStatus === "listed"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-amber-500/10 text-amber-600"
            }
          >
            {listing.inventoryStatus === "listed" ? "Active" : "Locked"}
          </Badge>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t">
          <Stat
            label="Asking Price"
            value={`$${listing.askingPrice.toLocaleString()}`}
          />
          <Stat
            label="Highest Bid"
            value={`$${highestBid.toLocaleString()}`}
            highlight
          />
          <Stat label="Total Bids" value={listing.bids.length} />
          <Stat label="Pending" value={pendingCount} highlight />
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            2d 14h remaining
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/user/bids/received/${listing.listingId}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Bids
          </Button>
        </div>

        {/* BIDS */}
        <div className="space-y-3 pt-2">
          {listing.bids.map((bid: any) => (
            <BidRow
              key={bid.id}
              bid={bid}
              isHighest={bid.bidAmount === highestBid}
              listingStatus={listing.inventoryStatus}
              hasAcceptedBid={listing.bids.some(
                (b: any) => b.status === "accepted",
              )}
              {...actions}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Stat = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: any;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={`font-semibold ${
        highlight ? "text-champagne" : "text-primary"
      }`}
    >
      {value}
    </p>
  </div>
);

export default ListingBidsGroup;
