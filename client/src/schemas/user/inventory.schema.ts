import { z } from "zod";
import { VALIDATION_PATTERNS } from "@/utils/validationHelpers";

/* =========================================================
   ENUMS (Single Source of Truth)
   ========================================================= */

export const SHAPES = [
  "ROUND", "PRINCESS", "CUSHION", "EMERALD",
  "OVAL", "RADIANT", "ASSCHER", "MARQUISE",
  "HEART", "PEAR"
] as const;

export const CUTS = ["EXCELLENT", "VERY_GOOD", "GOOD", "FAIR", "POOR"] as const;

export const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] as const;

export const CLARITIES = [
  "FL", "IF", "VVS1", "VVS2",
  "VS1", "VS2", "SI1", "SI2", "I1"
] as const;

export const LABS = ["GIA", "AGS", "IGI", "HRD", "EGL"] as const;

export const CURRENCIES = ["USD", "INR", "EUR"] as const;

/* =========================================================
   ENUM HELPER (Better UX)
   ========================================================= */

const enumField = <T extends readonly [string, ...string[]]>(
  values: T,
  label: string
) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((val) => values.includes(val as any), {
      message: `Please select a valid ${label.toLowerCase()}`,
    });

/* =========================================================
   SCHEMA
   ========================================================= */

export const inventorySchema = z
  .object({
    /* ---------- Basic Info ---------- */

    title: z
      .string()
      .min(2, "Title is required")
      .max(100, "Title too long")
      .regex(
        VALIDATION_PATTERNS.NO_EDGE_SPACES.value,
        VALIDATION_PATTERNS.NO_EDGE_SPACES.message
      ),

    description: z
      .string()
      .regex(
        VALIDATION_PATTERNS.DESCRIPTION.value,
        VALIDATION_PATTERNS.DESCRIPTION.message
      )
      .optional(),

    /* ---------- 4Cs ---------- */

    shape: enumField(SHAPES, "Shape"),
    cut: enumField(CUTS, "Cut"),
    color: enumField(COLORS, "Color"),
    clarity: enumField(CLARITIES, "Clarity"),

    carat: z
      .coerce.number({
        invalid_type_error: "Carat must be a valid number",
      })
      .min(0.01, "Carat must be greater than 0")
      .max(50, "Carat seems unrealistic"),

    /* ---------- Certification ---------- */

    lab: enumField(LABS, "Lab"),

    certificateNumber: z
      .string()
      .regex(
        VALIDATION_PATTERNS.CERTIFICATE_NUMBER.value,
        VALIDATION_PATTERNS.CERTIFICATE_NUMBER.message
      )
      .optional(),

    /* ---------- Location ---------- */

    location: z
      .string()
      .min(2, "Location is required")
      .max(100, "Location too long")
      .regex(
        VALIDATION_PATTERNS.NO_EDGE_SPACES.value,
        VALIDATION_PATTERNS.NO_EDGE_SPACES.message
      ),

    /* ---------- Pricing ---------- */

    currency: enumField(CURRENCIES, "Currency"),

    price: z
      .coerce.number({
        invalid_type_error: "Price must be a valid number",
      })
      .min(0.01, "Price must be greater than 0"),

    startingPrice: z
      .coerce.number({
        invalid_type_error: "Starting price must be a valid number",
      })
      .min(0.01, "Starting price must be greater than 0")
      .optional(),
  })

  /* ---------- Cross Field Validation ---------- */

  .refine(
    (data) => {
      if (data.startingPrice == null) return true;
      return data.startingPrice < data.price;
    },
    {
      message: "Starting price must be less than buy-now price",
      path: ["startingPrice"],
    }
  );

/* =========================================================
   TYPE EXPORT
   ========================================================= */

export type InventoryFormData = z.infer<typeof inventorySchema>;