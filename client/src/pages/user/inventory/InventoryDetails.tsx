import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  PlusCircle,
  Diamond as DiamondIcon,
  ShieldAlert,
} from "lucide-react";

// Redux & Logic Imports
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toast } from "@/hooks/use-toast";
import {
  fetchInventoryByIdRequest,
  clearSelectedInventory,
  deleteInventoryRequest // Assuming this exists in your slice
} from "@/store/slices/inventorySlice";

// UI Components
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux State
  const { selectedItem, loading } = useAppSelector((state) => state.inventory);
  const isLocked = Boolean(selectedItem?.locked);

  /* ============================
     LIFECYCLE & DATA FETCHING
  ============================ */
  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryByIdRequest(id));
    }
    return () => {
      dispatch(clearSelectedInventory());
    };
  }, [id, dispatch]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this diamond?") && id) {
      dispatch(deleteInventoryRequest(id)); 
      toast({ title: "Processing", description: "Deleting diamond..." });
      navigate("/user/inventory");
    }
  };

  if (loading && !selectedItem) {
    return (
      <DashboardShell>
        <div className="p-3 lg:p-2 space-y-8">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[400px] lg:col-span-1" />
            <Skeleton className="h-[400px] lg:col-span-2" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Fallback if item not found
  const diamond = selectedItem || {
    title: "Unknown Diamond",
    carat: 0,
    color: "N/A",
    clarity: "N/A",
    cut: "N/A",
    lab: "N/A",
    location: "Unknown",
    description: "No details available.",
    price: 0,
    currency: "USD",
    images: [],
  };

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/user/inventory")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-2">
                {diamond.title}
              </h1>
              {/* <p className="text-muted-foreground">
                Viewing Diamond ID: <span className="font-mono">{id}</span>
              </p> */}
            </div>

            <div className="flex items-center gap-3">
              {isLocked && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">
                  <ShieldAlert className="h-3 w-3 mr-1" /> Locked in Deal
                </Badge>
              )}
              <Badge className="bg-emerald-500/90 text-white px-4 py-1 text-sm">
                Available
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Section - Image/Media */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="card-premium overflow-hidden border-none shadow-xl">
              <div className="aspect-square bg-gradient-to-br from-diamond-shimmer to-pearl relative flex items-center justify-center">
                {diamond.images && diamond.images.length > 0 ? (
                  <img 
                    src={diamond.images[0]} 
                    alt={diamond.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <DiamondIcon className="h-24 w-24 text-champagne/30" />
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right Section - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="card-premium border-none shadow-lg">
              <CardContent className="p-6">
                
                {/* Specs Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-secondary/50">{diamond.carat}ct</Badge>
                  <Badge variant="secondary" className="bg-secondary/50">{diamond.color}</Badge>
                  <Badge variant="secondary" className="bg-secondary/50">{diamond.clarity}</Badge>
                  <Badge variant="secondary" className="bg-secondary/50">{diamond.cut}</Badge>
                  <Badge variant="secondary" className="bg-secondary/50">{diamond.lab}</Badge>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-primary/80 leading-relaxed">
                    {diamond.description || "No description provided for this item."}
                  </p>
                </div>

                {/* Pricing & Actions Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-6 gap-6">
                  <div>
                    <span className="font-display text-4xl font-bold text-primary">
                      ${diamond.price?.toLocaleString()}
                    </span>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tighter">
                      {diamond.currency}
                    </p>
                  </div>

                  {/* BUTTON GROUP - Kept inside the container */}
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      disabled={isLocked}
                      className="flex-1 sm:flex-none border-champagne hover:bg-champagne/10"
                      onClick={() => navigate(`/user/inventory/edit/${id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>

                    <Button 
                      className="btn-champagne text-primary flex-1 sm:flex-none shadow-md"
                      disabled={isLocked}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>

                    <Button 
                      variant="destructive" 
                      className="flex-1 sm:flex-none"
                      disabled={isLocked}
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extra Specifications Grid */}
            <Card className="card-premium border-none shadow-md">
              <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <Detail label="Shape" value={diamond.shape || "Round"} />
                <Detail label="Carat" value={`${diamond.carat} ct`} />
                <Detail label="Color" value={diamond.color} />
                <Detail label="Clarity" value={diamond.clarity} />
                <Detail label="Cut" value={diamond.cut} />
                <Detail label="Lab" value={diamond.lab} />
                <Detail label="Location" value={diamond.location} />
                <Detail label="Status" value={isLocked ? "Locked" : "Available"} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
};

/* Reusable Detail Component */
const Detail = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{label}</p>
    <p className="font-semibold text-primary">{value}</p>
  </div>
);

export default InventoryDetails;