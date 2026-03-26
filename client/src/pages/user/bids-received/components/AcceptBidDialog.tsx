import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { bidActions } from "@/store/slices/bidSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AcceptBidDialog = ({
  actionDialog,
  setActionDialog,
  selectedBid,
  setSelectedBid,
}: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.bid);

  if (!selectedBid) return null;

  const handleAccept = () => {
  dispatch(
    bidActions.updateBidRequest({
      bidId: selectedBid._id, // ✅ FIXED
      action: "ACCEPT",
      onSuccess: (data: any) => {
        setActionDialog(null);
        setSelectedBid(null);

        // ✅ Navigate to deal
        if (data?.deal?._id) {
          navigate(`/user/deals/${data.deal._id}`);
        }
      },
    })
  );
};

  return (
    <Dialog open={actionDialog === "accept"} onOpenChange={() => setActionDialog(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Bid</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          Accepting this bid will close the listing and create a deal. Continue?
        </p>
        <div className="py-2">
          <p className="text-sm font-medium">Bid Amount</p>
          <p className="text-xl font-bold text-emerald-600">
            ${selectedBid.bidAmount.toLocaleString()}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setActionDialog(null)}>
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Confirm Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptBidDialog;
