import type { RefObject } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdMediaUploadProps {
  mediaPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const AdMediaUpload = ({
  mediaPreview,
  onFileChange,
  onRemove,
  fileInputRef,
}: AdMediaUploadProps) => {
  const triggerInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {mediaPreview ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border bg-muted">
          <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={(e) => { e.preventDefault(); onRemove(); }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={triggerInput}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          className="w-full h-36 rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer select-none"
        >
          <Upload className="h-6 w-6 pointer-events-none" />
          <span className="text-sm font-medium pointer-events-none">
            Click to upload image or video
          </span>
          <span className="text-xs pointer-events-none">
            PNG, JPG, MP4 up to 10MB
          </span>
        </div>
      )}

      {/* Hidden file input — ref owned by parent */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={onFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default AdMediaUpload;