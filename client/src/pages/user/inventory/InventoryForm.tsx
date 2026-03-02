import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toast } from "@/hooks/use-toast";
import {
  createInventoryRequest,
  fetchInventoryByIdRequest,
  updateInventoryRequest,
  clearSelectedInventory,
} from "@/store/slices/inventorySlice";

import {
  inventorySchema,
  SHAPES,
  CUTS,
  COLORS,
  CLARITIES,
  LABS,
  CURRENCIES,
} from "@/schemas/user/inventory.schema";

type InventoryFormValues = z.infer<typeof inventorySchema>;

import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  CheckCircle,
  Info,
  Video,
} from "lucide-react";

import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InventoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const { selectedItem, loading } = useAppSelector((state) => state.inventory);
  const isLocked = Boolean(selectedItem?.locked);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      title: "",
      description: "",
      shape: undefined,
      carat: undefined,
      cut: undefined,
      color: undefined,
      clarity: undefined,
      lab: undefined,
      location: "",
      currency: "USD",
      price: undefined,
      startingPrice: undefined,
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryByIdRequest(id));
    }
    return () => {
      dispatch(clearSelectedInventory());
    };
  }, [id, dispatch]);


  useEffect(() => {
    if (selectedItem) {
      reset({
        title: selectedItem.title ?? "",
        description: selectedItem.description ?? "",
        shape: selectedItem.shape as (typeof SHAPES)[number] | undefined,
        carat: selectedItem.carat ? Number(selectedItem.carat) : undefined,
        cut: selectedItem.cut
          ? (selectedItem.cut.toUpperCase().replace(/ /g, "_") as
              | (typeof CUTS)[number]
              | undefined)
          : undefined,
        color: selectedItem.color as (typeof COLORS)[number] | undefined,
        clarity: selectedItem.clarity as (typeof CLARITIES)[number] | undefined,
        lab: selectedItem.lab as (typeof LABS)[number] | undefined,
        location: selectedItem.location ?? "",
        currency: (selectedItem.currency ?? "USD") as (typeof CURRENCIES)[number],
        price: selectedItem.price ? Number(selectedItem.price) : undefined,
        startingPrice: selectedItem.startingPrice
          ? Number(selectedItem.startingPrice)
          : undefined,
      });

      setExistingImages(selectedItem.images || []);
    }
  }, [selectedItem, reset]);



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideo(file);
  };


  const onSubmit = (data: InventoryFormValues) => {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      shape: data.shape,
      carat: data.carat,
      cut: data.cut,
      color: data.color,
      clarity: data.clarity,
      lab: data.lab,
      location: data.location,
      currency: data.currency,
      price: data.price,
      startingPrice: data.startingPrice || undefined,
    };

    const media: Record<string, any> = {};
    if (isEdit) {
      if (images.length > 0) media.newImages = images;
      if (video) media.newVideo = video;
    } else {
      if (images.length > 0) media.images = images;
      if (video) media.video = video;
    }

    const onSuccess = () => {
      toast({
        title: isEdit ? "Updated Successfully" : "Diamond Added",
        description: isEdit
          ? "Diamond updated successfully."
          : "Diamond added to your inventory.",
      });
      navigate("/user/inventory");
    };

    const onError = (message: string) => {
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive",
      });
    };

    if (isEdit && id) {
      dispatch(updateInventoryRequest({ id, data: payload, media, onSuccess, onError }));
    } else {
      dispatch(createInventoryRequest({ data: payload, media, onSuccess, onError }));
    }
  };

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate("/user/inventory")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-2">
            {isEdit ? "Edit Diamond" : "Add Diamond to Inventory"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update your diamond details below."
              : "Enter the diamond details to add it to your inventory"}
          </p>
        </motion.div>

        {isLocked && (
          <div className="p-4 rounded-xl bg-yellow-500/10 text-yellow-700 border border-yellow-300">
            This inventory item is locked in an active deal and cannot be
            modified.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, (errs) => {
            console.log("VALIDATION ERRORS:", errs);
          })}
          className="space-y-8"
        >
          {/* Media */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Diamond Images
              </CardTitle>
              <CardDescription>
                Upload high-quality images of your diamond (max 5 images)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Existing images (edit mode) */}
                {existingImages.map((url, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt={`existing-${index}`}
                    />
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* New images */}
                {images.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      className="w-full h-full object-cover"
                      alt={`new-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {!isLocked && existingImages.length + images.length < 5 && (
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={isLocked}
                      onChange={handleImageUpload}
                    />
                  </Label>
                )}
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label>Video (optional)</Label>
                {video ? (
                  <div className="flex items-center gap-4 rounded-xl border px-4 py-3">
                    <Video className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {video.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideo(null)}
                      className="bg-destructive text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Label htmlFor="video" className="cursor-pointer">
                    <div className="rounded-xl border-2 border-dashed flex items-center justify-center gap-3 py-5">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload a video
                      </span>
                    </div>
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      hidden
                      disabled={isLocked}
                      onChange={handleVideoUpload}
                    />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  {...register("title")}
                  disabled={isLocked}
                  className="h-12 rounded-xl"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea {...register("description")} disabled={isLocked} />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Diamond Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shape */}
              <div className="space-y-2">
                <Label>Shape</Label>
                <Controller
                  name="shape"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="h-12 rounded-xl" disabled={isLocked}>
                        <SelectValue placeholder="Select shape" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHAPES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.shape && (
                  <p className="text-sm text-destructive">
                    {errors.shape.message}
                  </p>
                )}
              </div>

              {/* Carat */}
              <div className="space-y-2">
                <Label>Carat Weight</Label>
                <Input
                  {...register("carat", { valueAsNumber: true })}
                  disabled={isLocked}
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="h-12 rounded-xl"
                />
                {errors.carat && (
                  <p className="text-sm text-destructive">
                    {errors.carat.message}
                  </p>
                )}
              </div>

              {/* Cut */}
              <div className="space-y-2">
                <Label>Cut</Label>
                <Controller
                  name="cut"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="h-12 rounded-xl" disabled={isLocked}>
                        <SelectValue placeholder="Select cut" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUTS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cut && (
                  <p className="text-sm text-destructive">
                    {errors.cut.message}
                  </p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label>Color</Label>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.color && (
                  <p className="text-sm text-destructive">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Clarity */}
              <div className="space-y-2">
                <Label>Clarity</Label>
                <Controller
                  name="clarity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select clarity" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLARITIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.clarity && (
                  <p className="text-sm text-destructive">
                    {errors.clarity.message}
                  </p>
                )}
              </div>

              {/* Lab */}
              <div className="space-y-2">
                <Label>Lab</Label>
                <Controller
                  name="lab"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select lab" />
                      </SelectTrigger>
                      <SelectContent>
                        {LABS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.lab && (
                  <p className="text-sm text-destructive">
                    {errors.lab.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2 md:col-span-2">
                <Label>Location</Label>
                <Input
                  {...register("location")}
                  disabled={isLocked}
                  className="h-12 rounded-xl"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Pricing & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Currency */}
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && (
                    <p className="text-sm text-destructive">
                      {errors.currency.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    {...register("price", { valueAsNumber: true })}
                    disabled={isLocked}
                    type="number"
                    min="0"
                    className="h-12 rounded-xl"
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Starting Price */}
                <div className="space-y-2">
                  <Label>Starting Price (optional)</Label>
                  <Input
                    {...register("startingPrice", { valueAsNumber: true })}
                    disabled={isLocked}
                    type="number"
                    min="0"
                    className="h-12 rounded-xl"
                  />
                  {errors.startingPrice && (
                    <p className="text-sm text-destructive">
                      {errors.startingPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl flex gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Starting Price must be less than Buy-Now Price.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user/inventory")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-premium flex-1"
              disabled={isLocked || loading}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isEdit ? "Update Diamond" : "Add to Inventory"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
};

export default InventoryForm;