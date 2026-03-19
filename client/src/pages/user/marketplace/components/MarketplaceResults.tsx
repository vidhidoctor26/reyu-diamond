import { motion, AnimatePresence } from "framer-motion";
import ListingCardGrid from "./ListingCardGrid";
import ListingCardList from "./ListingCardList";


interface MarketplaceResultsProps {
  listings: any[];
  viewMode: "grid" | "list";
}

const MarketplaceResults = ({ listings, viewMode }: MarketplaceResultsProps) => {
  return (
    <>
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-primary">
            {listings.length}
          </span>{" "}
          diamonds
        </p>
      </div>

      {/* Simple smooth animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              layout
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {viewMode === "grid" ? (
                <ListingCardGrid listing={listing} />
              ) : (
                <ListingCardList listing={listing} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MarketplaceResults;
