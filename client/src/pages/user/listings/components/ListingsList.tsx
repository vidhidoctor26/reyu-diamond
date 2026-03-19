import ListingCard from "./ListingCard";

interface Props {
  listings: any[];
  loading?: boolean;
}

const ListingsList = ({ listings, loading }: Props) => {
  console.log("LISTINGS:", listings);

  // ✅ REMOVE DUPLICATES
  const uniqueListings = Array.from(
    new Map(listings.map((item) => [item.id, item])).values()
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading listings...
      </div>
    );
  }

  if (!uniqueListings.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No listings found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {uniqueListings.map((listing: any, index: number) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          index={index}
        />
      ))}
    </div>
  );
};

export default ListingsList;