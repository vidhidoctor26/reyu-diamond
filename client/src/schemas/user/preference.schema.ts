import { z } from "zod";

/* ── Option Lists ────────────────────────────── */

export const SHAPES = [
  "Round",
  "Princess",
  "Cushion",
  "Oval",
  "Emerald",
  "Pear",
  "Marquise",
  "Radiant",
  "Asscher",
  "Heart",
] as const;

export const COLORS = [
  "D","E","F","G","H","I","J","K","L","M",
] as const;

export const CLARITIES = [
  "FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2",
] as const;

export const CERTIFICATIONS = [
  "GIA","IGI","AGS","HRD","EGL",
] as const;

export const CUTS = [
  "Ideal","Excellent","Very Good","Good","Fair",
] as const;

export const POLISHES = [
  "Excellent","Very Good","Good","Fair","Poor",
] as const;

export const SYMMETRIES = [
  "Excellent","Very Good","Good","Fair","Poor",
] as const;

export const FLUORESCENCES = [
  "None","Faint","Medium","Strong","Very Strong",
] as const;

export const CURRENCIES = [
  "USD","INR","EUR","GBP","AED",
] as const;

export const LOCATIONS = [
  "India","USA","Belgium","Hong Kong","Dubai","Israel","UK",
] as const;

/* ── Zod Schema ──────────────────────────────── */

export const preferenceSchema = z
  .object({
    shape: z.string().min(1, "Shape is required"),
    caratMin: z.coerce.number().min(0, "Must be ≥ 0"),
    caratMax: z.coerce.number().min(0, "Must be ≥ 0"),
    color: z.string().min(1, "Color is required"),
    clarity: z.string().min(1, "Clarity is required"),
    lab: z.boolean(),

    budget: z.coerce.number().min(0, "Budget must be ≥ 0"),
    currency: z.string().min(1, "Currency is required"),
    location: z.string().min(1, "Location is required"),

    labName: z.string().optional(),

    /* 🔥 NEW */
    pricePerCaratMin: z.coerce.number().min(0).optional().or(z.literal("")),
    pricePerCaratMax: z.coerce.number().min(0).optional().or(z.literal("")),

    cut: z.string().optional(),
    polish: z.string().optional(),
    symmetry: z.string().optional(),
    fluorescence: z.string().optional(),
    certification: z.string().optional(),
    priority: z.string().optional(),
    notes: z.string().max(500).optional(),
  })

  /* carat validation */
  .refine((data) => data.caratMax >= data.caratMin, {
    message: "Max carat must be ≥ min carat",
    path: ["caratMax"],
  })

  /* lab name validation */
  .refine(
    (data) => {
      if (data.lab && (!data.labName || data.labName.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Lab name required",
      path: ["labName"],
    },
  )

  /* price per carat validation */
  .refine(
    (data) => {
      if (data.pricePerCaratMin && data.pricePerCaratMax) {
        return data.pricePerCaratMax >= data.pricePerCaratMin;
      }
      return true;
    },
    {
      message: "Max must be ≥ Min",
      path: ["pricePerCaratMax"],
    },
  );

export type PreferenceFormData = z.infer<typeof preferenceSchema>;

export const EMPTY_FORM: PreferenceFormData = {
  shape: "",
  caratMin: 0.5,
  caratMax: 3,
  color: "",
  clarity: "",
  lab: false,
  budget: 10000,
  currency: "USD",
  location: "",
  labName: "",
  pricePerCaratMin: undefined,
  pricePerCaratMax: undefined,
  cut: "",
  polish: "",
  symmetry: "",
  fluorescence: "",
  certification: "",
  priority: "",
  notes: "",
};
