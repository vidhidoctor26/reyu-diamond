import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const schema = z
  .object({
    basePrice: z.number().min(1, "Base price required"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type FormData = z.infer<typeof schema>;

const CreateAuctionPage = () => {
  const { inventoryId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (!inventoryId) return;

dispatch(
  auctionActions.createAuctionRequest({
    inventoryId,
    basePrice: Number(data.basePrice),
    startDate: data.startDate,
    endDate: data.endDate,
    onSuccess: () => {
      toast({
        title: "Auction Created",
        description: "Your auction is now live.",
      });
      navigate("/user/auctions");
    },
    onError: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  }),
);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create Auction</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="number"
            placeholder="Base Price"
            {...register("basePrice", { valueAsNumber: true })}
          />
          {errors.basePrice && (
            <p className="text-red-500 text-sm">
              {errors.basePrice.message}
            </p>
          )}
        </div>

        <div>
          <Input type="datetime-local" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-red-500 text-sm">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <Input type="datetime-local" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-red-500 text-sm">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Auction
        </Button>
      </form>
    </div>
  );
};

export default CreateAuctionPage;