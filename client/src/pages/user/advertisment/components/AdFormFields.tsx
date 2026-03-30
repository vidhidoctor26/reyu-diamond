import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AdFormState {
  title: string;
  description: string;
  placement: string;    // → bannerSection on backend
  redirectLink: string; // → ctaLink on backend
  startDate: string;
  endDate: string;
}

interface AdFormFieldsProps {
  form: AdFormState;
  onChange: (updated: AdFormState) => void;
  linkError?: string;  // passed from parent when URL validation fails
}

const AdFormFields = ({ form, onChange, linkError }: AdFormFieldsProps) => {
  const set = (key: keyof AdFormState, value: string) =>
    onChange({ ...form, [key]: value });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Premium Round Brilliants Collection"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          minLength={5}
          maxLength={120}
        />
        {form.title.length > 0 && form.title.length < 5 && (
          <p className="text-xs text-destructive">Minimum 5 characters</p>
        )}
        <p className="text-xs text-muted-foreground text-right">
          {form.title.length}/120
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Briefly describe your advertisement..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.description.length}/500
        </p>
      </div>

      {/* Banner Section — values must exactly match backend enum */}
      <div className="space-y-2">
        <Label>
          Placement <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.placement}
          onValueChange={(v) => set("placement", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Where should this ad appear?" />
          </SelectTrigger>
          <SelectContent>
            {/*
              Backend enum: "HOME_DASHBOARD" | "MARKETPLACE" | "BANNER_ZONES"
              These values are sent directly as bannerSection — do NOT change them
            */}
            <SelectItem value="HOME_DASHBOARD">Home Dashboard</SelectItem>
            <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
            <SelectItem value="BANNER_ZONES">Banner Zones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Redirect / CTA Link */}
      <div className="space-y-2">
        <Label htmlFor="redirectLink">
          Redirect Link{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="redirectLink"
          type="url"
          placeholder="https://your-website.com/product"
          value={form.redirectLink}
          onChange={(e) => set("redirectLink", e.target.value)}
        />
        {/* show error from parent validation */}
        {linkError && (
          <p className="text-xs text-destructive">{linkError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Users will be redirected here when they click your ad
        </p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date{" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            min={today}
            value={form.startDate}
            onChange={(e) => {
              const val = e.target.value;
              // reset endDate if it falls before new startDate
              if (form.endDate && val > form.endDate) {
                onChange({ ...form, startDate: val, endDate: "" });
              } else {
                set("startDate", val);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date{" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            min={form.startDate || today}
            value={form.endDate}
            onChange={(e) => set("endDate", e.target.value)}
            disabled={!form.startDate}
          />
          {!form.startDate && (
            <p className="text-xs text-muted-foreground">Set a start date first</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdFormFields;