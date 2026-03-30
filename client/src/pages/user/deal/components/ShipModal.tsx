import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: (courier: string, trackingNumber: string) => void;
    loading: boolean;
}

const ShipModal = ({ open, onOpenChange, onConfirm, loading }: Props) => {
    console.log("ShipModal props", { open, loading });
    console.log("ShipModal render", { open, loading });
    const [courier, setCourier] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");

   const handleConfirm = () => {
  console.log("🔥 BUTTON CLICKED");

  if (!courier || !trackingNumber) {
    console.log("❌ Missing fields");
    return;
  }

  console.log("📦 Sending to parent", { courier, trackingNumber });

  onConfirm(courier, trackingNumber);
};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark as Shipped</DialogTitle>
                    <DialogDescription>Enter shipping details for this diamond.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Courier Name</Label>
                        <Input
                            placeholder="e.g. FedEx, DHL"
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tracking Number</Label>
                        <Input
                            placeholder="Enter tracking number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading || !courier || !trackingNumber}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                        Confirm Shipment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShipModal;