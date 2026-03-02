import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import InventoryRow from "./InventoryRow";
import type { InventoryItem } from "./inventory.types";

interface Props {
  items: InventoryItem[];
  onAddToAuction: (item: InventoryItem) => void;
}

const InventoryTable = ({ items, onAddToAuction }: Props) => {
  if (!items || items.length === 0) {
    return (
      <Card className="card-premium p-6 text-center text-muted-foreground">
        No inventory items found.
      </Card>
    );
  }

  return (
    <Card className="card-premium overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Diamond</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead>Certificate</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <InventoryRow
              key={item._id}
              item={item}
              onAddToAuction={onAddToAuction}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InventoryTable;