import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { motion } from "framer-motion";
import { ArrowLeft, Megaphone, Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AdFormFields, { type AdFormState } from "./components/AdFormFields";
import AdMediaUpload from "./components/AdMediaUpload";
import {
  createAdRequest,
  resetCreateState,
} from "@/store/slices/advertisementSlice";
import type { RootState } from "@/store";
import type { BannerSection } from "@/services/advertisement.service";

const CreateAdvertisement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { createLoading, createError, createSuccess } = useAppSelector(
    (state: RootState) => state.advertisement
  );

  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [mediaFile, setMediaFile]       = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaError, setMediaError]     = useState<string>("");
  const [linkError, setLinkError]       = useState<string>("");
  const [form, setForm] = useState<AdFormState>({
    title:        "",
    description:  "",
    placement:    "",
    redirectLink: "",
    startDate:    "",
    endDate:      "",
  });

  useEffect(() => {
    if (createSuccess) {
      dispatch(resetCreateState());
      navigate("/user/advertisements");
    }
  }, [createSuccess, dispatch, navigate]);

  useEffect(() => () => { dispatch(resetCreateState()); }, [dispatch]);

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

    if (!mediaFile) {
      setMediaError("Please upload an image or video for your ad");
      return;
    }

    // show error instead of silently returning — this was the bug
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
        media:         mediaFile,
      })
    );
  };

  const isSubmitDisabled =
    createLoading         ||
    !mediaFile            ||
    !form.title           ||
    form.title.length < 5 ||
    !form.placement;

  return (
    <DashboardShell>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/user/advertisements")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Create Advertisement
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details to promote your business
            </p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-accent" />
                  Ad Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
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
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, MP4 up to 10MB — required
                  </p>
                </div>

                {createError && (
                  <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg p-3">
                    {createError}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/user/advertisements")}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitDisabled} className="gap-2">
                {createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {createLoading ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardShell>
  );
};

export default CreateAdvertisement;