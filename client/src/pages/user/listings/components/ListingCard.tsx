import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { toast } from "@/hooks/use-toast";
import {
  Eye, Gavel, Diamond, MoreVertical, Pencil, Pause, Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

const ListingCard = ({ listing, index }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog]     = useState(false);

  const title     = `${listing.name || "Diamond"} ${listing.carat || ""}ct`;
  const specs     = `${listing.color || ""} / ${listing.clarity || ""}`;
  const price     = listing.price ?? listing.currentBid ?? listing.basePrice ?? 0;
  const bidsCount = listing.bids || listing.bidIds?.length || 0;
  const expires   = listing.endDate
    ? new Date(listing.endDate).toLocaleDateString()
    : "-";
  const thumbnail = listing.images?.[0] || null;

  const { register, handleSubmit } = useForm({
    defaultValues: {
      basePrice: price,
      startDate: listing.startDate
        ? new Date(listing.startDate).toISOString().slice(0, 16)
        : "",
      endDate: listing.endDate
        ? new Date(listing.endDate).toISOString().slice(0, 16)
        : "",
    },
  });

  /* ── Status rules ── */
  const canEdit   = listing.status === "upcoming";
  const canDelete = listing.status === "upcoming" || listing.status === "ended";
  const canPause  = listing.status === "active";

  /* ── Handlers ── */
  const handleViewDetails = () => navigate(`/user/marketplace/${listing.id}`);
  const handleViewBids    = () => navigate(`/user/bids/received/${listing.id}`);

  const handleEdit = (data: any) => {
    dispatch(auctionActions.updateAuctionRequest({
      auctionId: listing.id,
      updates: {
        basePrice: Number(data.basePrice),
        startDate: data.startDate,
        endDate:   data.endDate,
      },
      onSuccess: () => {
        toast({ title: "Auction Updated", description: "Changes saved successfully." });
        setShowEditDialog(false);
        dispatch(auctionActions.fetchMyAuctionsRequest({
          sellerId: user?._id || user?.id,
        }));
      },
      onError: (msg: string) => {
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    }));
  };

  const handleDelete = () => {
    dispatch(auctionActions.deleteAuctionRequest({
      auctionId: listing.id,
      onSuccess: () => {
        toast({ title: "Auction Deleted", description: "Listing removed successfully." });
        setShowDeleteDialog(false);
      },
      onError: (msg: string) => {
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":    return <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>;
      case "upcoming":  return <Badge className="bg-yellow-500/10 text-yellow-600">Upcoming</Badge>;
      case "ended":     return <Badge className="bg-blue-500/10 text-blue-600">Ended</Badge>;
      case "cancelled": return <Badge className="bg-red-500/10 text-red-600">Cancelled</Badge>;
      default:          return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="card-premium">
          <CardContent className="p-6 flex justify-between items-center">

            {/* LEFT */}
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-accent/10 flex items-center justify-center flex-shrink-0">
                {thumbnail
                  ? <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                  : <Diamond className="h-6 w-6 text-accent/70" />
                }
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{title}</h3>
                  {getStatusBadge(listing.status)}
                </div>
                <p className="text-sm text-muted-foreground">{specs}</p>
                <div className="flex gap-4 text-sm mt-1 text-muted-foreground">
                  <span className="flex gap-1 items-center"><Eye className="h-4 w-4" /> 0 views</span>
                  <span className="flex gap-1 items-center"><Gavel className="h-4 w-4" /> {bidsCount} bids</span>
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

                  <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleViewDetails}>
                    <Eye className="h-4 w-4" /> View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleViewBids}>
                    <Gavel className="h-4 w-4" /> View Bids
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={!canEdit}
                    onClick={() => canEdit && setShowEditDialog(true)}
                  >
                    <Pencil className="h-4 w-4" /> Edit Auction
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={!canPause}
                    onClick={() => canPause && toast({ title: "Coming Soon", description: "Pause feature is under development." })}
                  >
                    <Pause className="h-4 w-4" /> Pause Auction
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    disabled={!canDelete}
                    onClick={() => canDelete && setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete Auction
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {/* ── Edit Dialog ── */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit Auction
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Base Price</Label>
              <Input type="number" {...register("basePrice", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="datetime-local" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="datetime-local" {...register("endDate")} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1"
                onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Auction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the listing and unlock the diamond from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default memo(ListingCard);