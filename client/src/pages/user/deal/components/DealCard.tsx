import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Diamond } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DealStatusBadge, { type DealStatus } from "./DealStatusBadge";

export interface DealCardData {
    id: string;
    sellerId: string;
    diamond: { shape: string; carat: string; color: string; clarity: string; cut: string };
    buyer: string;
    seller?: string;
    amount: number;
    status: DealStatus;
    createdAt: string;
    thumbnail?: string;
}

type Props = {
    deal: DealCardData;
    index: number;
    onStartChat: (deal: DealCardData) => void; // ✅ NEW
};

const DealCard = ({ deal, index, onStartChat }: Props) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.04 }}
    >
        <Card className="card-premium">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shrink-0 overflow-hidden">
                            {deal.thumbnail
                                ? <img src={deal.thumbnail} alt={deal.diamond.shape} className="w-full h-full object-cover" />
                                : <Diamond className="h-6 w-6 text-champagne" />
                            }
                        </div>

                        <div>
                            <p className="font-medium text-sm">
                                {deal.diamond.shape} {deal.diamond.carat}ct
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {deal.diamond.color}/{deal.diamond.clarity}/{deal.diamond.cut}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>Buyer: <span className="text-foreground">{deal.buyer}</span></span>
                                <span>•</span>
                                <span>Seller: <span className="text-foreground">{deal.seller}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                        <p className="font-display text-xl font-semibold text-primary">
                            ${deal.amount.toLocaleString()}
                        </p>

                        <DealStatusBadge status={deal.status} />

                        {/* ✅ CHAT BUTTON */}
                        <Button size="sm" onClick={() => onStartChat(deal)}>  {/* ✅ pass full deal */}
                            Chat
                        </Button>

                        <Link to={`/user/deals/${deal.id}`}>
                            <Button variant="outline" size="sm">
                                View Deal
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default DealCard;