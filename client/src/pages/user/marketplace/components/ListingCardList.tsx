import { Diamond, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ListingCardListProps {
  listing: {
    id: string;
    name: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    price: number;
    change: string;
    trending: boolean;
    views: number;
    bids: number;
    seller: string;
    images: string[];
  };
}

const ListingCardList = ({ listing }: ListingCardListProps) => {
  return (
    <Link to={`/user/marketplace/${listing.id}`}>
      <Card className="card-premium p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6">

          {/* Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-diamond-shimmer to-pearl flex items-center justify-center flex-shrink-0">
            {listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Diamond className="h-10 w-10 text-accent/40" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display text-lg font-semibold text-primary">
                  {listing.name}
                </h3>
                <p className="text-sm text-muted-foreground">{listing.seller}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                listing.trending ? "text-emerald-600" : "text-rose-500"
              }`}>
                {listing.trending
                  ? <TrendingUp className="h-4 w-4" />
                  : <TrendingDown className="h-4 w-4" />
                }
                {listing.change}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{listing.carat}ct</Badge>
              <Badge variant="secondary">{listing.color}</Badge>
              <Badge variant="secondary">{listing.clarity}</Badge>
              <Badge variant="secondary">{listing.cut}</Badge>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="font-display text-2xl font-semibold text-primary">
              ${listing.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />{listing.views}
              </span>
              <span>{listing.bids} bids</span>
            </div>
          </div>

          {/* Place Bid — stop Link navigation */}
          <Button
            className="btn-champagne text-primary whitespace-nowrap"
            onClick={(e) => e.preventDefault()}
          >
            Place Bid
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCardList;