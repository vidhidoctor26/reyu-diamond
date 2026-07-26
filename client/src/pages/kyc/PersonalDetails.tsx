import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { kycActions } from "@/store/slices/kycSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authActions } from "@/store/slices/authSlice";

import {
  personalDetailsSchema,
  type PersonalDetailsType,
} from "@/schemas/kyc/kyc.schema";

/* ================= COMPONENT ================= */

const PersonalDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { personalDetails } = useAppSelector((state) => state.kyc);

  /* ===== FORM ===== */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalDetailsType>({
    defaultValues: personalDetails,
    resolver: zodResolver(personalDetailsSchema),
    mode: "onChange",
  });

  /* ===== SUBMIT ===== */
  const onSubmit = (data: PersonalDetailsType) => {
    // Save data in redux
    dispatch(kycActions.setPersonalDetails(data));

    // Move step forward
    dispatch(kycActions.goToStep("DOCUMENT_UPLOAD"));

    navigate("/kyc/document-upload");
  };



const handleSkipKyc = () => {
  dispatch(kycActions.skipKyc());

  dispatch(
    authActions.setCompliance({
      kycStatus: "PENDING",
    })
  );

  navigate("/user", { replace: true });
};


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12
    bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.38),_transparent_65%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="card-premium glass p-8 md:p-10">
          <div className="text-center mb-10">
            <span className="badge">Step 1 of 3 · Identity</span>
            <h1 className="text-3xl font-semibold">Personal Information</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="First Name" error={errors.firstName?.message}>
                <Input {...register("firstName")} />
              </Field>

              <Field label="Middle Name" error={errors.middleName?.message}>
                <Input {...register("middleName")} />
              </Field>

              <Field label="Last Name" error={errors.lastName?.message}>
                <Input {...register("lastName")} />
              </Field>
            </div>

            {/* DOB + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Date of Birth" error={errors.dob?.message}>
                <Input type="date" {...register("dob")} />
              </Field>

              <Field label="Phone" error={errors.phone?.message}>
                <Input {...register("phone")} />
              </Field>
            </div>

            {/* Address */}
            <Field label="Address" error={errors.address?.message}>
              <Input {...register("address")} />
            </Field>

            <div className="grid md:grid-cols-4 gap-4">
              <Field label="City" error={errors.city?.message}>
                <Input {...register("city")} />
              </Field>

              <Field label="State" error={errors.state?.message}>
                <Input {...register("state")} />
              </Field>

              <Field label="Pincode" error={errors.pincode?.message}>
                <Input {...register("pincode")} />
              </Field>

              <Field label="Country" error={errors.country?.message}>
                <Input {...register("country")} />
              </Field>
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-6">
              <Button type="button" onClick={() => navigate(-1)}>
                Back
              </Button>

              <Button type="button" variant="ghost" onClick={handleSkipKyc}>
                Skip
              </Button>

              <Button type="submit" disabled={!isValid}>
                Continue
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default PersonalDetails;

/* ================= FIELD ================= */
const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
