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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Gavel, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "./components/inventory.types";

const schema = z.object({
  basePrice: z.number().min(1, "Price is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormData = z.infer<typeof schema>;

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAuctionModal = ({ item, onClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auction);

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { basePrice: item.price || 0 },
  });

  const onSubmit = (data: FormData) => {
    dispatch(auctionActions.createAuctionRequest({
      inventoryId: item._id,
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      onSuccess: () => {
        toast({ title: "Auction Created", description: "Successfully listed." });
        onSuccess();
      },
      onError: (msg: string) => toast({ title: "Error", description: msg, variant: "destructive" }),
    }));
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 bg-white">
          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="text-xs font-bold uppercase text-slate-500">Starting Bid (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="basePrice"
                type="number"
                className="pl-9 h-12 border-slate-200 focus:ring-blue-500"
                {...register("basePrice", { valueAsNumber: true })}
              />
            </div>
            {errors.basePrice && <p className="text-xs text-red-500">{errors.basePrice.message}</p>}
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            {[ 
              { name: "startDate" as const, label: "Start Date" }, 
              { name: "endDate" as const, label: "End Date" } 
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">{field.label}</Label>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { value, onChange } }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal h-12 border-slate-200",
                            !value && "text-muted-foreground"
                          )}
                        >
                          {value ? format(value, "PPP") : <span>Pick date</span>}
                          <CalendarIcon className="h-4 w-4 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={value}
                          onSelect={onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors[field.name] && <p className="text-[10px] text-red-500">{errors[field.name]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-12 text-slate-500">
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="flex-1 h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white">
              {loading ? "Processing..." : "Confirm Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionModal;