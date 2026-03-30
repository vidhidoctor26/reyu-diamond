import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import RatingStars from "./RatingStars";
import type { DealRating } from "../types/rating.types";

interface RatingModalProps {
  open: boolean;
  onSubmit: (rating: Omit<DealRating, "dealId" | "submittedAt">) => Promise<void>;
  onDismiss: () => void;
  isSubmitting: boolean;
  dealInfo?: { shape: string; carat: string; dealId: string };
}

const categoryLabels: { key: keyof DealRating["categories"]; label: string; emoji: string }[] = [
  { key: "communication", label: "Communication", emoji: "💬" },
  { key: "productQuality", label: "Product Quality", emoji: "💎" },
  { key: "delivery", label: "Delivery", emoji: "📦" },
  { key: "pricing", label: "Pricing", emoji: "💰" },
  { key: "professionalism", label: "Professionalism", emoji: "🤝" },
];

const RatingModal = ({ open, onSubmit, onDismiss, isSubmitting, dealInfo }: RatingModalProps) => {
  const [overall, setOverall] = useState(0);
  const [categories, setCategories] = useState<DealRating["categories"]>({
    communication: 0, productQuality: 0, delivery: 0, pricing: 0, professionalism: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");

  const updateCategory = (key: keyof DealRating["categories"], value: number) => {
    setCategories((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (overall === 0) {
      setError("Please provide an overall rating");
      return;
    }
    if (reviewText.length > 0 && reviewText.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }
    setError("");
    await onSubmit({ overall, categories, reviewText, anonymous });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mb-2"
          >
            <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
          </motion.div>
          <DialogTitle className="font-display text-xl">Rate Your Experience</DialogTitle>
          <DialogDescription>
            Help improve trust and transparency in the marketplace
            {dealInfo && (
              <span className="block text-xs mt-1 text-muted-foreground">
                {dealInfo.shape} {dealInfo.carat}ct • {dealInfo.dealId}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 max-h-[60vh] overflow-y-auto">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Overall Rating <span className="text-destructive">*</span></Label>
            <div className="flex justify-center">
              <RatingStars value={overall} onChange={setOverall} size="lg" />
            </div>
          </div>

          <Separator />

          {/* Category Ratings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Category Ratings (optional)</Label>
            {categoryLabels.map(({ key, label, emoji }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1.5">
                  <span>{emoji}</span> {label}
                </span>
                <RatingStars value={categories[key]} onChange={(v) => updateCategory(key, v)} size="sm" />
              </div>
            ))}
          </div>

          <Separator />

          {/* Review Text */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Written Review (optional)</Label>
            <Textarea
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="resize-none"
            />
            {reviewText.length > 0 && reviewText.length < 10 && (
              <p className="text-xs text-destructive">Minimum 10 characters</p>
            )}
          </div>

          {/* Anonymous */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(v) => setAnonymous(v === true)}
            />
            <Label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer">
              Submit anonymously
            </Label>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onDismiss} disabled={isSubmitting} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || overall === 0} className="w-full sm:w-auto gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
