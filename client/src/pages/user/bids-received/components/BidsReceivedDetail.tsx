import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Diamond, Clock, Shield, User, MessageSquare, Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { bidActions } from "@/store/slices/bidSlice";
import { auctionActions } from "@/store/slices/auctionSlice";

const getTimeLeft = (endDate?: string): string => {
  if (!endDate) return "—";
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const BidsReceivedDetail = () => {
  const { listingId } = useParams(); // listingId = auctionId
  const navigate      = useNavigate();
  const dispatch      = useAppDispatch();

  const { auctionBids, loading } = useAppSelector((s) => s.bid);
  const { selectedAuction }      = useAppSelector((s) => s.auction);

  useEffect(() => {
    if (!listingId) return;
    dispatch(auctionActions.fetchAuctionByIdRequest(listingId));
    dispatch(bidActions.fetchAuctionBidsRequest(listingId));
    return () => { dispatch(auctionActions.clearSelectedAuction()); };
  }, [listingId, dispatch]);

  const inv = (selectedAuction?.inventoryId as any);

  const bids = useMemo(() =>
    [...auctionBids].sort((a, b) => b.bidAmount - a.bidAmount),
    [auctionBids]
  );

  const highestBid  = bids[0]?.bidAmount ?? 0;
  const activeCount = bids.filter((b) => b.status === "ACTIVE").length;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":   return <Badge className="bg-amber-500/10 text-amber-600">Active</Badge>;
      case "ACCEPTED": return <Badge className="bg-emerald-500/10 text-emerald-600">Accepted</Badge>;
      case "REJECTED": return <Badge className="bg-rose-500/10 text-rose-500">Rejected</Badge>;
      case "EXPIRED":  return <Badge className="bg-muted text-muted-foreground">Expired</Badge>;
      default:         return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading && !selectedAuction) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6 lg:p-8 space-y-8">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bids Received
        </button>

        {/* LISTING HEADER CARD */}
        {selectedAuction && (
          <Card className="card-premium">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    {inv?.images?.[0]
                      ? <img src={inv.images[0]} alt={inv.shape} className="w-full h-full object-cover" />
                      : <Diamond className="h-6 w-6 text-accent/70" />
                    }
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold">
                        {inv?.shape} {inv?.carat}ct
                      </h2>
                      <Badge className={
                        selectedAuction.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }>
                        {selectedAuction.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {inv?.color}/{inv?.clarity}/{inv?.cut}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {getTimeLeft(selectedAuction.endDate)}
                  </div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="text-2xl font-semibold">
                    ${selectedAuction.basePrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-sm">
                <Attr label="Shape"   value={inv?.shape   || "-"} />
                <Attr label="Carat"   value={inv?.carat   ? `${inv.carat}ct` : "-"} />
                <Attr label="Color"   value={inv?.color   || "-"} />
                <Attr label="Clarity" value={inv?.clarity || "-"} />
                <Attr label="Cut"     value={inv?.cut     || "-"} />
                <Attr label="Lab"     value={inv?.lab     || "-"} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* BIDS HEADER */}
        <div>
          <h3 className="text-xl font-semibold">Bids ({bids.length})</h3>
          <p className="text-sm text-muted-foreground">
            {activeCount} active • Highest: ${highestBid.toLocaleString()}
          </p>
        </div>

        {/* BIDS LIST */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Diamond className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No bids yet on this listing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid: any, i) => (
              <Card
                key={bid._id}
                className={`card-premium ${i === 0 ? "border-emerald-300 ring-1 ring-emerald-200" : ""}`}
              >
                <CardContent className="p-5 flex justify-between items-center">
                  {/* LEFT */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {(bid.buyerId as any)?.name || "Buyer"}
                        </p>
                        <Shield className="h-4 w-4 text-emerald-500" />
                        {i === 0 && (
                          <span className="text-xs text-emerald-600 font-medium">
                            Highest Bid
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(bid.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-xl font-semibold ${i === 0 ? "text-emerald-600" : "text-accent"}`}>
                        ${bid.bidAmount.toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(bid.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

const Attr = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default BidsReceivedDetail;