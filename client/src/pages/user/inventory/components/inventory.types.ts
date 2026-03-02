export type InventoryStatus = "available" | "listed" | "in_deal";

export interface InventoryItem {
  id: string;
  images:string[];
  name: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  status: InventoryStatus;
  lab: string;
  addedDate: string;
}
