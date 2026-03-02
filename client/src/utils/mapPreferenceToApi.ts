import type { PreferenceFormData } from "@/schemas/user/preference.schema";

export const mapPreferenceToApi = (data: PreferenceFormData) => {
  return {
    intent: {
      shape: [data.shape],
      carat: {
        min: data.caratMin,
        max: data.caratMax,
      },
      color: [data.color],
      clarity: [data.clarity],
      lab: data.lab,
      labName: data.labName ? [data.labName] : [],
    },

    constraints: {
      budget: data.budget,
      currency: data.currency,
      location: [data.location],
      pricePerCarat:
        data.pricePerCaratMin || data.pricePerCaratMax
          ? {
              min: data.pricePerCaratMin || 0,
              max: data.pricePerCaratMax || data.pricePerCaratMin || 0,
            }
          : undefined,
    },

    preferences: {
      cut: data.cut ? [data.cut] : [],
      polish: data.polish ? [data.polish] : [],
      symmetry: data.symmetry ? [data.symmetry] : [],
      fluorescence: data.fluorescence ? [data.fluorescence] : [],
      certificate: data.certification ? [data.certification] : [],
      notes: data.notes,
      priority:
        data.priority === "Low"
          ? 1
          : data.priority === "Medium"
            ? 2
            : data.priority === "High"
              ? 3
              : data.priority === "Urgent"
                ? 4
                : 0,
    },
  };
};
