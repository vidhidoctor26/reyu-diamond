import { Diamond, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DealStatusBadge, { type DealStatus } from "./DealStatusBadge";

interface Props {
    diamond: { shape: string; carat: string; color: string; clarity: string; cut: string };
    amount: number;
    buyer: string;
    seller: string;
    dealId: string;
    status: DealStatus;
    createdAt: string;
    pdfPath?: string;
    onDownloadPdf: () => void;
    pdfLoading: boolean;
    thumbnail?: string;
}

const DealSummary = ({
    diamond, amount, buyer, seller, dealId,
    status, createdAt, onDownloadPdf, pdfLoading, thumbnail,
}: Props) => (
    <Card className="card-premium">
        <CardHeader className="pb-3">
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center mb-3 overflow-hidden">
                {thumbnail
                    ? <img src={thumbnail} alt={diamond.shape} className="w-full h-full object-cover" />
                    : <Diamond className="h-12 w-12 text-champagne" />
                }
            </div>
            <CardTitle className="font-display text-lg">
                {diamond.shape} {diamond.carat}ct
            </CardTitle>
            <DealStatusBadge status={status} />
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3 text-sm">
            {[
                ["Specs", `${diamond.color} / ${diamond.clarity} / ${diamond.cut}`],
                ["Amount", `$${amount.toLocaleString()}`],
                ["Buyer", buyer],
                ["Seller", seller],
                ["Deal ID", dealId],
                ["Created", new Date(createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                })],
            ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                </div>
            ))}
            <Separator />
            <Button
                variant="outline"
                onClick={onDownloadPdf}
                disabled={pdfLoading}
                className="w-full gap-2"
            >
                {pdfLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Download className="h-4 w-4" />
                }
                Download PDF
            </Button>
        </CardContent>
    </Card>
);

export default DealSummary;