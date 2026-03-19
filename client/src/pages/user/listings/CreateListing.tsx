import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { 
  ArrowLeft, 
  Diamond, 
  Info,
  Calendar,
  CheckCircle,
  Package
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


const inventoryItems = [
  { id: "INV-001", name: "Round Brilliant 2.5ct", specs: "D/VVS1/EX", price: 24500 },
  { id: "INV-002", name: "Oval Brilliant 2.0ct", specs: "D/IF/EX", price: 32100 },
  { id: "INV-003", name: "Cushion Cut 1.5ct", specs: "E/VS2/VG", price: 12800 },
];

const CreateListing = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    inventoryItem: "",
    listingType: "fixed",
    price: "",
    minBid: "",
    duration: "30",
    description: "",
    allowCounterOffers: true,
    autoRenew: false,
  });

  const selectedItem = inventoryItems.find(item => item.id === formData.inventoryItem);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.inventoryItem) {
    return alert("Please select inventory item");
  }

  if (!formData.price) {
    return alert("Please enter price");
  }

  if (formData.listingType !== "auction") {
    alert("Only auction supported currently");
    return;
  }

  const startDate = new Date().toISOString();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + Number(formData.duration));

  dispatch(
    auctionActions.createAuctionRequest({
      inventoryId: formData.inventoryItem,
      basePrice: Number(formData.price),
      startDate,
      endDate: endDate.toISOString(),

      onSuccess: () => {
        navigate("/user/listings");
      },

      onError: (err) => {
        console.error(err);
        alert(err);
      },
    })
  );
};

  return (
    <DashboardShell>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/user/listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-2">
            Create New Listing
          </h1>
          <p className="text-muted-foreground">
            List a diamond from your inventory on the marketplace
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Select Diamond */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">Select Diamond</CardTitle>
                <CardDescription>
                  Choose a diamond from your inventory to list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setFormData({ ...formData, inventoryItem: item.id, price: item.price.toString() })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.inventoryItem === item.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-diamond-shimmer to-pearl flex items-center justify-center">
                          <Diamond className="h-7 w-7 text-accent/50" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-primary">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.specs} • {item.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-semibold text-primary">
                            ${item.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Inventory Value</p>
                        </div>
                        {formData.inventoryItem === item.id && (
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                <Link to="/user/inventory/add" 
                className="inline-flex items-center gap-2 text-accent hover:underline mt-4 ml-auto">
                  <Package className="h-4 w-4" />
                  Add new diamond to inventory
                </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listing Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">Listing Type</CardTitle>
                <CardDescription>
                  Choose how you want to sell your diamond
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.listingType}
                  onValueChange={(v) => setFormData({ ...formData, listingType: v })}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.listingType === "fixed"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}>
                    <RadioGroupItem value="fixed" id="fixed" className="sr-only" />
                    <Label htmlFor="fixed" className="cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-lg font-semibold text-primary">Fixed Price</span>
                        {formData.listingType === "fixed" && (
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Set a fixed price for your diamond. Buyers can make offers below your asking price.
                      </p>
                    </Label>
                  </div>

                  <div className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.listingType === "auction"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}>
                    <RadioGroupItem value="auction" id="auction" className="sr-only" />
                    <Label htmlFor="auction" className="cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-lg font-semibold text-primary">Auction</span>
                        {formData.listingType === "auction" && (
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Let buyers compete with bids. Highest bidder wins when the auction ends.
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">Pricing</CardTitle>
                <CardDescription>
                  Set your listing price and bidding options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {formData.listingType === "fixed" ? "Asking Price (USD)" : "Starting Price (USD)"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="pl-8 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  {formData.listingType === "fixed" && (
                    <div className="space-y-2">
                      <Label htmlFor="minBid">Minimum Acceptable Offer (Optional)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="minBid"
                          type="number"
                          placeholder="0.00"
                          value={formData.minBid}
                          onChange={(e) => setFormData({ ...formData, minBid: e.target.value })}
                          className="pl-8 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {formData.listingType === "fixed" && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <Label htmlFor="counterOffers" className="font-medium">Allow Counter Offers</Label>
                      <p className="text-sm text-muted-foreground">
                        Let buyers negotiate with you on price
                      </p>
                    </div>
                    <Switch
                      id="counterOffers"
                      checked={formData.allowCounterOffers}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowCounterOffers: checked })}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">Listing Duration</CardTitle>
                <CardDescription>
                  How long should your listing remain active?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <Label htmlFor="autoRenew" className="font-medium">Auto-Renew</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically renew listing when it expires
                    </p>
                  </div>
                  <Switch
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoRenew: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">Additional Details</CardTitle>
                <CardDescription>
                  Add any extra information for potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional details, unique features, or selling points..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[120px] rounded-xl resize-none"
                  />
                </div>

                <div className="mt-4 p-4 rounded-xl bg-accent/10 flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary">
                    Your listing will be visible to all verified traders on the marketplace. You can edit or pause your listing at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary & Actions */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="card-premium bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                        <Diamond className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">{selectedItem.name}</h4>
                        <p className="text-primary-foreground/70">{selectedItem.specs}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary-foreground/70">Listing Price</p>
                      <p className="font-display text-2xl font-semibold text-accent">
                        ${Number(formData.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            <Button type="button" variant="outline" onClick={() => navigate("/user/listings")} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.inventoryItem}
              className="btn-accent text-primary flex-1"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Publish Listing
            </Button>
          </motion.div>
        </form>
      </div>
    </DashboardShell>
  );
};

export default CreateListing;
