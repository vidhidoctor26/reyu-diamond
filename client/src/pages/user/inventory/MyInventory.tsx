import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryTable from "./components/InventoryTable";
import CreateAuctionModal from "./CreateAuctionModal";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchInventoryRequest } from "@/store/slices/inventorySlice";
import type { InventoryItem } from "./components/inventory.types";

const MyInventory = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state) => state.inventory
  );

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  useEffect(() => {
    dispatch(fetchInventoryRequest());
  }, [dispatch]);

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        <InventoryHeader />
        <InventoryStats items={items ?? []} />

        {loading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && (
          <InventoryTable
            items={items ?? []}
            onAddToAuction={(item) => setSelectedItem(item)}
          />
        )}
      </div>

      {selectedItem && (
        <CreateAuctionModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            setSelectedItem(null);
            dispatch(fetchInventoryRequest());
          }}
        />
      )}
    </DashboardShell>
  );
};

export default MyInventory;