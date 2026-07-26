import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* ─── Inner form (must be inside <Elements>) ─── */
interface PaymentFormProps {
    amount: number;
    dealId: string;
    onSuccess: () => void;
    onError?: (msg: string) => void;
}

const PaymentForm = ({ amount, onSuccess, onError }: PaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        setSubmitting(true);
        setMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stripe redirects here after 3DS — update to your real return URL
                return_url: `${window.location.origin}/user/deals`,
            },
            redirect: "if_required",
        });

        if (error) {
            const msg = error.message || "Payment failed. Please try again.";
            setMessage(msg);
            if (onError) onError(msg);
            setSubmitting(false);
        } else {
            // Payment succeeded (no redirect needed)
            onSuccess();
        }
    };

    return (
        <div className="space-y-5">
            {/* Amount summary */}
            <div className="rounded-xl bg-muted/50 border px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-lg font-semibold font-display">
                    ${amount.toLocaleString()}
                </span>
            </div>

            {/* Stripe Payment Element */}
            <PaymentElement
                options={{
                    layout: "tabs",
                }}
            />

            {/* Error message */}
            {message && (
                <p className="text-sm text-destructive text-center">{message}</p>
            )}

            {/* Submit */}
            <Button
                onClick={handleSubmit}
                disabled={submitting || !stripe || !elements}
                className="w-full gap-2"
                size="lg"
            >
                {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <ShieldCheck className="h-4 w-4" />
                )}
                {submitting ? "Processing..." : `Pay $${amount.toLocaleString()}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Secured by Stripe · Funds held in escrow until delivery
            </p>
        </div>
    );
};

/* ─── Modal wrapper ─── */
interface StripePaymentModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    clientSecret: string;
    amount: number;
    dealId: string;
    onSuccess: () => void;
    onError?: (msg: string) => void;
}

const StripePaymentModal = ({
    open,
    onOpenChange,
    clientSecret,
    amount,
    dealId,
    onSuccess,
    onError,
}: StripePaymentModalProps) => {
    const appearance = {
        theme: "stripe" as const,
        variables: {
            colorPrimary: "#c9a96e",        // matches your champagne brand colour
            borderRadius: "8px",
            fontFamily: "inherit",
        },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                        Complete Payment
                    </DialogTitle>
                    <DialogDescription>
                        Your payment will be held securely in escrow and released to
                        the seller only after you confirm delivery.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {clientSecret ? (
                    <Elements
                        stripe={stripePromise}
                        options={{ clientSecret, appearance }}
                    >
                        <PaymentForm
                            amount={amount}
                            dealId={dealId}
                            onSuccess={() => {
                                onOpenChange(false);
                                onSuccess();
                            }}
                            onError={onError}
                        />
                    </Elements>
                ) : (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StripePaymentModal;