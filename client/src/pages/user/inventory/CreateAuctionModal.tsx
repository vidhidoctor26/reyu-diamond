import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Gavel, DollarSign } from "lucide-react";
import type { InventoryItem } from "./components/inventory.types";

/**
 * ✅ UPDATED SCHEMA
 */
const schema = z
  .object({
    basePrice: z.number().min(1, "Base price required"),

    startDate: z.date(),
    startTime: z.string().min(1, "Start time required"),

    endDate: z.date(),
    endTime: z.string().min(1, "End time required"),
  })
  .refine(
    (data) => {
      const start = new Date(
        `${format(data.startDate, "yyyy-MM-dd")}T${data.startTime}`
      );
      const end = new Date(
        `${format(data.endDate, "yyyy-MM-dd")}T${data.endTime}`
      );
      return end > start;
    },
    {
      message: "End must be after start",
      path: ["endTime"],
    }
  );

type FormData = z.infer<typeof schema>;

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAuctionModal = ({ item, onClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auction);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { basePrice: item.price || 0 },
  });

  /**
   * ✅ UPDATED SUBMIT
   */
  const onSubmit = (data: FormData) => {
    const startLocal = `${format(data.startDate, "yyyy-MM-dd")}T${data.startTime}`;
    const endLocal = `${format(data.endDate, "yyyy-MM-dd")}T${data.endTime}`;

    const startDateISO = new Date(startLocal).toISOString();
    const endDateISO = new Date(endLocal).toISOString();

    dispatch(
      auctionActions.createAuctionRequest({
        inventoryId: item._id,
        basePrice: data.basePrice,
        startDate: startDateISO,
        endDate: endDateISO,
        onSuccess: () => {
          toast({
            title: "Auction Created",
            description: "Successfully listed.",
          });
          onSuccess();
        },
        onError: (msg: string) =>
          toast({
            title: "Error",
            description: msg,
            variant: "destructive",
          }),
      })
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none">
        <div className="bg-[#1e293b] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-white">
              <Gavel className="w-5 h-5 text-blue-400" />
              Create Auction
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Listing <strong>{item.carat}ct {item.shape}</strong> for bidding.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 bg-white"
        >
          {/* Price */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Starting Bid (USD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                className="pl-9 h-12"
                {...register("basePrice", { valueAsNumber: true })}
              />
            </div>
            {errors.basePrice && (
              <p className="text-xs text-red-500">
                {errors.basePrice.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {["startDate", "endDate"].map((name) => (
              <Controller
                key={name}
                control={control}
                name={name as "startDate" | "endDate"}
                render={({ field: { value, onChange } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12">
                        {value ? format(value, "PPP") : "Pick date"}
                        <CalendarIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={8}
                      className="w-auto p-0 z-50"
                    >
                      <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            ))}
          </div>

          {/* 🔥 TIME INPUTS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Start Time</Label>
              <Input type="time" {...register("startTime")} />
              {errors.startTime && (
                <p className="text-xs text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs ">End Time</Label>
              <Input type="time" {...register("endTime")} />
              {errors.endTime && (
                <p className="text-xs text-red-500">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="flex-1">
              {loading ? "Processing..." : "Confirm Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionModal;