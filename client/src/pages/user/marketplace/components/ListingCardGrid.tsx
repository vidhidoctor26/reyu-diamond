import { motion } from "framer-motion";
import { Diamond, Eye, Heart, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ListingCardGridProps {
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

const ListingCardGrid = ({ listing }: ListingCardGridProps) => {
  return (
    <Link to={`/user/marketplace/${listing.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <Card className="card-premium overflow-hidden group cursor-pointer">

          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-diamond-shimmer to-pearl overflow-hidden">

            {listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Diamond className="h-20 w-20 text-accent/30" />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Trending Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={listing.trending ? "bg-emerald-500/90 text-white" : "bg-muted/90"}>
                {listing.trending ? (
                  <><TrendingUp className="h-3 w-3 mr-1" />Hot</>
                ) : "New"}
              </Badge>
            </div>

            {/* Image count pill */}
            {listing.images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                1 / {listing.images.length}
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg font-semibold text-primary">
                {listing.name}
              </h3>
              <div className={`flex items-center gap-1 text-sm ${
                listing.trending ? "text-emerald-600" : "text-rose-500"
              }`}>
                {listing.trending
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />
                }
                {listing.change}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <Badge variant="secondary">{listing.carat}ct</Badge>
              <Badge variant="secondary">{listing.color}</Badge>
              <Badge variant="secondary">{listing.clarity}</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{listing.seller}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-display text-xl font-semibold text-primary">
                ${listing.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />{listing.views}
                </span>
                <span>{listing.bids} bids</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ListingCardGrid;