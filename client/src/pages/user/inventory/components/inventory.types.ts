import type { InventoryItem as SliceInventoryItem } from "@/store/slices/inventorySlice";

export type InventoryStatus = "available" | "listed" | "on_memo" | "sold" | "in_deal";

export type InventoryItem = SliceInventoryItem & {
  id?: string;
  name?: string;
  addedDate?: string;
  isLocked?: boolean;
  certificateNumber?: string;
};
