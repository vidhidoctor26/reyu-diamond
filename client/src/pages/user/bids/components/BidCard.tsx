import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, MoreVertical, ExternalLink, Eye } from "lucide-react";
import BidStatusBadge from "./BidStatusBadge";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const BidCard = ({ bid }: any) => (
  <Card className="card-premium">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Diamond className="h-6 w-6 text-accent/70" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                to={`/user/marketplace/${bid.listingId}`}
                className="font-semibold text-primary hover:underline"
              >
                {bid.listingName}
              </Link>
              <BidStatusBadge status={bid.status} />
              {bid.isHighest && (
                <span className="text-xs text-emerald-600 font-medium">
                  Highest Bid
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">{bid.specs}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Seller: {bid.seller} • {formatDate(bid.placedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Your Bid</p>
            <p className="text-xl font-semibold text-primary">
              ${bid.myBid.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Ask: ${bid.askingPrice.toLocaleString()}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/user/marketplace/${bid.listingId}`} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" /> View Listing
                </Link>
              </DropdownMenuItem>
              {bid.status === "accepted" && bid.dealId && (
                <DropdownMenuItem asChild>
                  <Link to={`/user/deals/${bid.dealId}`} className="cursor-pointer text-primary font-medium">
                    <ExternalLink className="h-4 w-4 mr-2" /> View Deal
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default BidCard;