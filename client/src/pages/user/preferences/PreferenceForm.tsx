import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, SlidersHorizontal } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { mapPreferenceToApi } from "@/utils/mapPreferenceToApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  preferenceSchema,
  EMPTY_FORM,
  SHAPES,
  COLORS,
  CLARITIES,
  CERTIFICATIONS,
  CUTS,
  POLISHES,
  SYMMETRIES,
  FLUORESCENCES,
  CURRENCIES,
  LOCATIONS,
  type PreferenceFormData,
} from "@/schemas/user/preference.schema";
import { PreferenceService } from "@/services/preference.service";

/* ── Helpers ──────────────────────────────────── */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
    {children}
  </h2>
);

const SelectField = ({
  field,
  placeholder,
  options,
}: {
  field: any;
  placeholder: string;
  options: readonly string[];
}) => (
  <Select value={field.value} onValueChange={field.onChange}>
    <FormControl>
      <SelectTrigger className="rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ── Page ─────────────────────────────────────── */

const PreferenceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Load initial values for edit
  const initialValues = (() => {
    if (!isEdit) return EMPTY_FORM;
    const stored = sessionStorage.getItem(`pref_edit_${id}`);
    if (stored) {
      try {
        return { ...EMPTY_FORM, ...JSON.parse(stored) };
      } catch {
        return EMPTY_FORM;
      }
    }
    return EMPTY_FORM;
  })();

  const form = useForm({
    resolver: zodResolver(preferenceSchema) as any,
    defaultValues: initialValues,
  });

  const labValue = form.watch("lab");


  const onSubmit = async (data: PreferenceFormData) => {
    const payload = mapPreferenceToApi(data);

    try {
      if (isEdit && id) {
        await PreferenceService.update(id, payload);
      } else {
        await PreferenceService.create(payload);
      }

      toast({
        title: isEdit ? "Updated" : "Created",
        description: "Requirement saved successfully",
      });

      navigate("/user/preferences");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed",
        variant: "destructive",
      });
    }
  };

useEffect(() => {
  if (!id) return;

  PreferenceService.getOne(id).then((res) => {
    const r = res.data.data;

    form.reset({
      ...r,
    });
  });
}, [id]);

  const handleCancel = () => {
    if (id) sessionStorage.removeItem(`pref_edit_${id}`);
    navigate("/user/preferences");
  };

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8 max-w-4xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Preferences
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-2">
              {isEdit ? "Edit Preference" : "Create Preference"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update your diamond requirement criteria."
              : "Define your diamond requirements to receive tailored recommendations."}
          </p>
        </motion.div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {/* ─── Section 1: Core Requirement (Required) ─── */}
              <Card className="p-6 sm:p-8 rounded-xl shadow-soft border-border/60 mb-6">
                <SectionTitle>Diamond Intent</SectionTitle>
                <div className="grid gap-5">
                  {/* Shape */}
                  <FormField
                    control={form.control}
                    name="shape"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Shape <span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectField
                          field={field}
                          placeholder="Select shape"
                          options={SHAPES}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Carat Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="caratMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Carat Min{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={0.1}
                              min={0}
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="caratMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Carat Max{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={0.1}
                              min={0}
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Color */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Color <span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectField
                          field={field}
                          placeholder="Select color"
                          options={COLORS}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Clarity */}
                  <FormField
                    control={form.control}
                    name="clarity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Clarity <span className="text-destructive">*</span>
                        </FormLabel>
                        <SelectField
                          field={field}
                          placeholder="Select clarity"
                          options={CLARITIES}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lab-grown Toggle */}
                  <FormField
                    control={form.control}
                    name="lab"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                        <div>
                          <FormLabel className="text-sm font-medium">
                            Lab-Grown Diamond
                          </FormLabel>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Is this a lab-created diamond?
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Lab Name (conditional) */}
                  {labValue && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <FormField
                        control={form.control}
                        name="labName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Lab Name{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. CVD, HPHT"
                                className="rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Constraints sub-section */}
                <div className="mt-8">
                  <SectionTitle>Constraints</SectionTitle>
                  <div className="grid gap-5">
                    {/* Budget */}
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Budget <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={100}
                              min={0}
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Currency & Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Currency{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <SelectField
                              field={field}
                              placeholder="Select"
                              options={CURRENCIES}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Location{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <SelectField
                              field={field}
                              placeholder="Select"
                              options={LOCATIONS}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* ─── Section 2: Advanced Filters (Optional) ─── */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <Card className="rounded-xl shadow-soft border-border/60 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-6 sm:px-8 py-5 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Advanced Filters
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (Optional)
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          advancedOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 grid gap-5 border-t border-border/40">
                      {/* Price Per Carat */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pricePerCaratMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price / Carat Min</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={10}
                                  placeholder="Min"
                                  className="rounded-xl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pricePerCaratMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price / Carat Max</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={10}
                                  placeholder="Max"
                                  className="rounded-xl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Cut & Polish */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cut"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cut</FormLabel>
                              <SelectField
                                field={field}
                                placeholder="Select"
                                options={CUTS}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="polish"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Polish</FormLabel>
                              <SelectField
                                field={field}
                                placeholder="Select"
                                options={POLISHES}
                              />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Symmetry & Fluorescence */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="symmetry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Symmetry</FormLabel>
                              <SelectField
                                field={field}
                                placeholder="Select"
                                options={SYMMETRIES}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fluorescence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fluorescence</FormLabel>
                              <SelectField
                                field={field}
                                placeholder="Select"
                                options={FLUORESCENCES}
                              />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Certification */}
                      <FormField
                        control={form.control}
                        name="certification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certification</FormLabel>
                            <SelectField
                              field={field}
                              placeholder="Select"
                              options={CERTIFICATIONS}
                            />
                          </FormItem>
                        )}
                      />

                      {/* Priority */}
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <SelectField
                              field={field}
                              placeholder="Select"
                              options={["Low", "Medium", "High", "Urgent"]}
                            />
                          </FormItem>
                        )}
                      />

                      {/* Notes */}
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any specific requirements or preferences…"
                                className="rounded-xl resize-none min-h-[80px]"
                                maxLength={500}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? "Update Preference" : "Save Preference"}
                </Button>
              </div>
            </motion.div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
};

export default PreferenceForm;
