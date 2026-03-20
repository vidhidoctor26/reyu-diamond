import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { bidActions } from "@/store/slices/bidSlice";
import { auctionToMarketplace } from "@/adapters/auction.adapter";
import DashboardShell from "@/components/layout/DashboardShell";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond, Eye, Heart, TrendingUp, TrendingDown, ArrowLeft,
  Clock, Shield, Award, Users, Loader2, ChevronLeft, ChevronRight,
  Gavel, Plus, Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const getTimeLeft = (endDate?: Date | string): string => {
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

/* ════════════════════════════════════════════════
PLACE BID MODAL
════════════════════════════════════════════════ */
const PlaceBidModal = ({
  
  open, onOpenChange, listing, auctionId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  listing: any;
  auctionId: string;
}) => {
  const dispatch = useAppDispatch();
  const { placing, error: bidError, successMessage } = useAppSelector((s) => s.bid);
  
  const minBid = listing.price + 1;
  const STEP = 500;
  
  const [bidAmount, setBidAmount] = useState(minBid);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);
  const { kycStatus } = useAppSelector((state) => state.auth);
  const isKycApproved = kycStatus === "APPROVED";
  
  useEffect(() => {
    if (open) {
      setBidAmount(minBid);
      setLocalError("");
      setSuccess(false);
      dispatch(bidActions.clearBidError());
      dispatch(bidActions.clearBidSuccess());
    }
  }, [open, minBid]);

  useEffect(() => {
    if (successMessage) setSuccess(true);
  }, [successMessage]);

const handleSubmit = () => {
  if (bidAmount < minBid) {
    setLocalError(`Bid must be at least $${minBid.toLocaleString()}`);
    return;
  }
  setLocalError("");

  console.log("🎯 SUBMITTING BID:", { auctionId, bidAmount });  // ← add this

  dispatch(bidActions.placeBidRequest({
    auctionId,
    bidAmount,
    onError: (msg: string) => setLocalError(msg),
  }));
};

  const errorMsg = localError || bidError || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Place a Bid</DialogTitle>
          <DialogDescription>
            {listing.name} {listing.carat}ct &middot; {listing.color} / {listing.clarity}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <Gavel className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-primary">Bid Placed!</p>
              <p className="text-muted-foreground text-sm mt-1">
                Your bid of{" "}
                <span className="font-semibold text-primary">${bidAmount.toLocaleString()}</span>{" "}
                has been submitted.
              </p>
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
          </motion.div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Price summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="font-display font-bold text-primary text-lg">
                  ${listing.price.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Minimum Bid</p>
                <p className="font-display font-bold text-champagne text-lg">
                  ${minBid.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bid input */}
            <div className="space-y-2">
              <Label>Your Bid Amount</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon"
                  onClick={() => setBidAmount((p) => Math.max(minBid, p - STEP))}
                  disabled={bidAmount <= minBid}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Math.max(minBid, Number(e.target.value)))}
                    className="pl-7 text-center font-semibold"
                    min={minBid}
                  />
                </div>
                <Button variant="outline" size="icon"
                  onClick={() => setBidAmount((p) => p + STEP)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick increments */}
              <div className="flex gap-2 pt-1">
                {[1000, 5000, 10000].map((inc) => (
                  <button key={inc}
                    onClick={() => setBidAmount((p) => p + inc)}
                    className="flex-1 text-xs py-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all">
                    +${inc.toLocaleString()}
                  </button>
                ))}
              </div>

              {errorMsg && <p className="text-sm text-rose-500">{errorMsg}</p>}
            </div>

            <Button
              className="btn-premium text-primary-foreground w-full h-12 text-base"
              onClick={handleSubmit}
              disabled={placing || bidAmount < minBid}
            >
              {placing
                ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Placing Bid...</>
                : <><Gavel className="h-5 w-5 mr-2" />Bid ${bidAmount.toLocaleString()}</>
              }
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By placing a bid you agree to our auction terms and conditions.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
const MarketplaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
const { selectedAuction, loading, error } = useAppSelector((s) => s.auction);
const { highestBid } = useAppSelector((s) => s.bid);
const { kycStatus } = useAppSelector((s) => s.auth);        // ← add this
const isKycApproved = kycStatus === "APPROVED"; 
  const { user } = useAppSelector((s) => s.auth);
const isOwnListing = (selectedAuction?.sellerId as any)?._id === user?._id;

  useEffect(() => {
    if (!id) return;
    dispatch(auctionActions.fetchAuctionByIdRequest(id));
    dispatch(bidActions.fetchHighestBidRequest(id));
    return () => { dispatch(auctionActions.clearSelectedAuction()); };
  }, [id, dispatch]);

  useEffect(() => { setActiveImage(0); }, [selectedAuction?._id]);

  const listing = selectedAuction ? auctionToMarketplace(selectedAuction) : null;
  const images: string[] = (selectedAuction?.inventoryId as any)?.images || [];
  const hasImages = images.length > 0;
  const isEnded = listing?.status === "ended" || listing?.status === "cancelled";

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !listing) {
    return (
      <DashboardShell>
        <div className="p-8 text-center space-y-3">
          <p className="text-muted-foreground">{error || "Diamond not found."}</p>
          <Button variant="link" onClick={() => navigate("/user/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">

        <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground"
          onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: Image Viewer ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl border bg-gradient-to-br from-diamond-shimmer to-pearl overflow-hidden">
              <AnimatePresence mode="wait">
                {hasImages ? (
                  <motion.img key={activeImage} src={images[activeImage]}
                    alt={`${listing.name} - image ${activeImage + 1}`}
                    initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
                    className="w-full h-full object-cover" />
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center">
                    <Diamond className="h-40 w-40 text-accent/30" />
                  </motion.div>
                )}
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                    {activeImage + 1} / {images.length}
                  </div>
                </>
              )}

              <div className="absolute top-4 left-4">
                <Badge className={listing.trending ? "bg-emerald-500/90 text-white" : "bg-muted/90"}>
                  {listing.trending ? <><TrendingUp className="h-3 w-3 mr-1" />Hot</> : "New"}
                </Badge>
              </div>

              <button onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((src, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                      activeImage === idx ? "border-primary ring-2 ring-primary/30" : "border-border opacity-60 hover:opacity-100"
                    }`}>
                    <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6">

            <div>
              <div className="flex items-center justify-between mb-1">
                <h1 className="font-display text-3xl font-semibold text-primary">{listing.name}</h1>
                <div className={`flex items-center gap-1 text-sm ${listing.trending ? "text-emerald-600" : "text-rose-500"}`}>
                  {listing.trending ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {listing.change}
                </div>
              </div>
              <p className="text-muted-foreground">{listing.seller}</p>
            </div>

            {/* Price + highest bid */}
            <div>
              <div className="font-display text-4xl font-bold text-primary">
                ${listing.price.toLocaleString()}
              </div>
              {highestBid && (
                <p className="text-sm text-muted-foreground mt-1">
                  Highest bid:{" "}
                  <span className="font-semibold text-champagne">
                    ${highestBid.bidAmount.toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Carat",   value: `${listing.carat} ct` },
                { label: "Color",   value: listing.color },
                { label: "Clarity", value: listing.clarity },
                { label: "Cut",     value: listing.cut },
              ].map(({ label, value }) => (
                <Card key={label} className="card-premium">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold text-primary">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Stats */}
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {listing.views} views</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {listing.bids} bids</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {getTimeLeft(listing.endDate)}
              </span>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-3 flex-wrap">
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" /> Verified Seller
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <Award className="h-3.5 w-3.5 text-champagne" /> GIA Certified
              </Badge>
            </div>

            
            {/* CTA */}
<div className="flex gap-3 mt-auto pt-2">
  <div className="flex-1 space-y-1">
   <Button
  className="btn-premium text-primary-foreground w-full h-12 text-base"
  onClick={() => !isOwnListing && setShowBidModal(true)}
  disabled={isEnded || isOwnListing || !isKycApproved}
>
  <Gavel className="h-5 w-5 mr-2" />
  {isEnded ? "Auction Ended" : isOwnListing ? "Your Listing" : "Place Bid"}
</Button>
{!isKycApproved && !isEnded && !isOwnListing && (
  <p className="text-xs text-center text-muted-foreground">
    <a href="/kyc/start" className="underline underline-offset-2 hover:text-primary transition-colors">
      Complete KYC verification
    </a>{" "}
    to place bids.
  </p>
)}
    {!isKycApproved && !isEnded && (
      <p className="text-xs text-center text-muted-foreground">
        <a href="/kyc/start" className="underline underline-offset-2 hover:text-primary transition-colors">
          Complete KYC verification
        </a>{" "}
        to place bids.
      </p>
    )}
  </div>
  <Button variant="outline" className="h-12 px-5">
    Contact Seller
  </Button>
</div>

          </motion.div>
        </div>
      </div>

      <PlaceBidModal
        open={showBidModal}
        onOpenChange={setShowBidModal}
        listing={listing}
        auctionId={id!}
      />
    </DashboardShell>
  );
};

export default MarketplaceDetailPage;