import {
  Diamond,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Upload,
  Lock,
} from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "./inventory.types";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { deleteInventoryRequest } from "@/store/slices/inventorySlice";
import { toast } from "@/hooks/use-toast";

interface Props {
  item: InventoryItem;
  onAddToAuction: (item: InventoryItem) => void;
}

const InventoryRow = ({ item, onAddToAuction }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const badgeClass =
    item.status === "available"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
      : item.status === "sold"
      ? "bg-blue-500/10 text-blue-600 border-blue-200"
      : "bg-accent/10 text-accent border-accent/20";

  const handleDelete = () => {
    if (!item._id) return;

    if (
      window.confirm(
        "Are you sure you want to delete this diamond? This action is permanent."
      )
    ) {
      dispatch(
        deleteInventoryRequest({
          id: item._id,
          onSuccess: () => {
            toast({
              title: "Deleted",
              description: "Diamond removed from your inventory.",
            });
          },
          onError: (message: string) => {
            toast({
              title: "Delete failed",
              description: message,
              variant: "destructive",
            });
          },
        })
      );
    }
  };

  return (
    <TableRow className={item.isLocked ? "opacity-70" : ""}>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-accent/10 flex items-center justify-center border border-border/50">
            {item.images?.length ? (
              <img
                src={item.images[0]}
                alt={`${item.carat}ct ${item.shape}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Diamond className="h-6 w-6 text-accent/70" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-primary">
                {item.carat}ct {item.shape}
              </p>
              {item.isLocked && (
                <Lock className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {item.certificateNumber ||
                item._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Badge variant="outline">{item.color}</Badge>
          <Badge variant="outline">{item.clarity}</Badge>
          <Badge variant="outline">{item.cut}</Badge>
        </div>
      </TableCell>

      <TableCell className="font-semibold uppercase">
        {item.lab}
      </TableCell>

      <TableCell className="font-semibold">
        ${item.price?.toLocaleString() || "0"}
      </TableCell>

      <TableCell>
        <Badge variant="outline" className={badgeClass}>
          {item.status.replace("_", " ")}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigate(`/user/inventory/view/${item._id}`)
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>

            {!item.isLocked && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/user/inventory/edit/${item._id}`)
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                {item.status === "available" && (
                  <DropdownMenuItem
                    onClick={() => onAddToAuction(item)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add to Auction
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}

            {item.isLocked && (
              <DropdownMenuItem disabled>
                Item locked (active trade)
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default InventoryRow;