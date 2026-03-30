import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Loader2, Megaphone } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AdFormFields, { type AdFormState } from "./AdFormFields";
import AdMediaUpload from "./AdMediaUpload";
import { createAdRequest, resetCreateState } from "@/store/slices/advertisementSlice";
import type { Advertisement } from "@/store/slices/advertisementSlice";
import type { BannerSection } from "@/services/advertisement.service";
import type { RootState } from "@/store";

interface AdEditModalProps {
  ad: Advertisement | null;
  open: boolean;
  onClose: () => void;
}

const AdEditModal = ({ ad, open, onClose }: AdEditModalProps) => {
  const dispatch = useAppDispatch();
  const { createLoading, createError, createSuccess } = useAppSelector(
    (state: RootState) => state.advertisement
  );

  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [mediaFile, setMediaFile]       = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaError, setMediaError]     = useState("");
  const [linkError, setLinkError]       = useState("");

  const [form, setForm] = useState<AdFormState>({
    title:        "",
    description:  "",
    placement:    "",
    redirectLink: "",
    startDate:    "",
    endDate:      "",
  });

  // Pre-fill form when ad changes
  useEffect(() => {
    if (ad) {
      setForm({
        title:        ad.title        || "",
        description:  ad.description  || "",
        placement:    ad.bannerSection?.[0] || "",
        redirectLink: ad.ctaLink      || "",
        startDate:    ad.startDate ? ad.startDate.split("T")[0] : "",
        endDate:      ad.endDate   ? ad.endDate.split("T")[0]   : "",
      });
      // show existing media as preview
      if (ad.mediaUrl) setMediaPreview(ad.mediaUrl);
    }
  }, [ad]);

  // Close on success
  useEffect(() => {
    if (createSuccess) {
      dispatch(resetCreateState());
      onClose();
    }
  }, [createSuccess, dispatch, onClose]);

  // Reset on unmount / close
  useEffect(() => {
    if (!open) {
      setMediaFile(null);
      setMediaPreview(ad?.mediaUrl || null);
      setMediaError("");
      setLinkError("");
      dispatch(resetCreateState());
    }
  }, [open, ad, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMediaError("File must be under 10MB");
      return;
    }
    setMediaError("");
    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMediaError("");
    setLinkError("");

    if (!form.title || form.title.length < 5) return;
    if (!form.placement) return;

    // if no new file selected, require existing mediaUrl
    if (!mediaFile && !ad?.mediaUrl) {
      setMediaError("Please upload an image or video");
      return;
    }

    if (form.redirectLink && !/^https?:\/\/.+/.test(form.redirectLink)) {
      setLinkError("Must start with http:// or https://");
      return;
    }

    dispatch(
      createAdRequest({
        title:         form.title,
        description:   form.description  || undefined,
        bannerSection: form.placement    as BannerSection,
        ctaLink:       form.redirectLink || undefined,
        startDate:     form.startDate    || undefined,
        endDate:       form.endDate      || undefined,
        media:         mediaFile         || undefined, // undefined = backend keeps existing if no new file
      })
    );
  };

  const isSubmitDisabled =
    createLoading         ||
    !form.title           ||
    form.title.length < 5 ||
    !form.placement       ||
    (!mediaFile && !ad?.mediaUrl);

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-accent" />
            Edit Advertisement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AdFormFields
            form={form}
            onChange={setForm}
            linkError={linkError}
          />

          <div className="space-y-2">
            <Label>
              Media Upload <span className="text-destructive">*</span>
            </Label>
            <AdMediaUpload
              mediaPreview={mediaPreview}
              onFileChange={handleFileChange}
              onRemove={handleRemoveMedia}
              fileInputRef={fileInputRef}
            />
            {mediaError && (
              <p className="text-xs text-destructive">{mediaError}</p>
            )}
            {ad.mediaUrl && !mediaFile && (
              <p className="text-xs text-muted-foreground">
                Current media will be kept unless you upload a new file
              </p>
            )}
          </div>

          {createError && (
            <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg p-3">
              {createError}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} className="gap-2">
              {createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {createLoading ? "Resubmitting..." : "Resubmit for Approval"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdEditModal;