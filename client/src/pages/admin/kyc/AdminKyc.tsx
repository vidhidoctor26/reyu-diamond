import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import {
    Search, Loader2, CheckCircle2, XCircle, Clock,
    User, Phone, MapPin, CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AdminKyc } from "@/store/slices/adminSlice";

const statusConfig = {
    pending: { label: "Pending", color: "border-amber-400  text-amber-600  bg-amber-50  dark:bg-amber-900/20", icon: Clock },
    approved: { label: "Approved", color: "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "border-rose-400   text-rose-600   bg-rose-50   dark:bg-rose-900/20", icon: XCircle },
} as const;

const DEFAULT_STATUS = {
    label: "Unknown",
    color: "border-slate-400 text-slate-500 bg-slate-50",
    icon: Clock,
};

// Detail modal to show full KYC info
const KycDetailModal = ({
    kyc, onClose, onApprove, onReject, actionLoading,
}: {
    kyc: AdminKyc;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    actionLoading: boolean;
}) => (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-display">
                    {kyc.firstName} {kyc.middleName ?? ""} {kyc.lastName}
                </DialogTitle>
                <DialogDescription>{kyc.userId?.email}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
                {/* Personal */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <User className="h-3 w-3" /> Full Name
                        </p>
                        <p className="font-medium">
                            {kyc.firstName} {kyc.middleName ?? ""} {kyc.lastName}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Phone
                        </p>
                        <p className="font-medium">{kyc.phone}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                        <p className="font-medium">
                            {kyc.dob ? new Date(kyc.dob).toLocaleDateString("en-IN") : "—"}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Location
                        </p>
                        <p className="font-medium">
                            {kyc.address?.city}, {kyc.address?.state}
                        </p>
                    </div>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" /> Documents
                    </p>

                    <div className="grid grid-cols-2 gap-3">

                        {/* Aadhaar */}
                        <a
                            href={kyc.documents?.aadhaar?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-border hover:border-primary/40 transition block"
                        >
                            <p className="text-xs text-muted-foreground">Aadhaar</p>
                            <p className="font-mono font-medium">
                                •••• •••• {kyc.documents?.aadhaar?.aadhaarLast4}
                            </p>
                            <p className="text-xs text-primary mt-1 underline">
                                View document →
                            </p>
                        </a>

                        {/* PAN */}
                        <a
                            href={kyc.documents?.pan?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-border hover:border-primary/40 transition block"
                        >
                            <p className="text-xs text-muted-foreground">PAN</p>
                            <p className="font-mono font-medium">
                                •••••• {kyc.documents?.pan?.panLast4}
                            </p>
                            <p className="text-xs text-primary mt-1 underline">
                                View document →
                            </p>
                        </a>

                    </div>

                    {/* Selfie */}
                    {kyc.documents?.selfie?.url && (
                        <a
                            href={kyc.documents.selfie.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 transition"
                        >
                            <img
                                src={kyc.documents.selfie.url}
                                alt="Selfie"
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                                <p className="text-xs text-muted-foreground">Selfie</p>
                                <p className="text-xs text-primary underline">View →</p>
                            </div>
                        </a>
                    )}
                </div>

                {/* Address */}
                <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Address
                    </p>
                    <p className="font-medium leading-relaxed">
                        {kyc.address?.residentialAddress}, {kyc.address?.city},{" "}
                        {kyc.address?.state} — {kyc.address?.pincode}
                    </p>
                </div>
            </div>

            {kyc.status === "pending" && (
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="outline"
                        className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 flex-1"
                        onClick={onApprove}
                        disabled={actionLoading}
                    >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        className="border-rose-400 text-rose-600 hover:bg-rose-50 flex-1"
                        onClick={onReject}
                        disabled={actionLoading}
                    >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                </DialogFooter>
            )}
        </DialogContent>
    </Dialog>
);

const AdminKycPage = () => {
    const dispatch = useAppDispatch();
    const { kycs = [], kycsLoading, actionLoading } = useAppSelector((s) => s.admin);

    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"ALL" | "pending" | "approved" | "rejected">("ALL");
    const [selected, setSelected] = useState<AdminKyc | null>(null);
    const [rejectModal, setRejectModal] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        dispatch(adminActions.fetchKycsRequest());
    }, [dispatch]);

    const filtered = kycs.filter((k) => {
        const fullName = `${k.firstName ?? ""} ${k.lastName ?? ""}`.toLowerCase();
        const matchSearch =
            fullName.includes(search.toLowerCase()) ||
            k.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
            k.documents?.aadhaar?.aadhaarLast4?.includes(search) ||
            k.documents?.pan?.panLast4?.includes(search);
        const matchTab = tab === "ALL" || k.status === tab;
        return matchSearch && matchTab;
    });

    const counts = {
        ALL: kycs.length,
        pending: kycs.filter((k) => k.status === "pending").length,
        approved: kycs.filter((k) => k.status === "approved").length,
        rejected: kycs.filter((k) => k.status === "rejected").length,
    };

    const handleApprove = (kyc: AdminKyc) => {
        dispatch(adminActions.verifyKycRequest({ id: kyc._id, status: "APPROVED" }));
        setSelected(null);
    };

    const handleReject = () => {
        if (!selected) return;
        dispatch(adminActions.verifyKycRequest({
            id: selected._id,
            status: "REJECTED",
            rejectionReason: reason,
        }));
        setSelected(null);
        setRejectModal(false);
        setReason("");
    };

    return (
        <div className="p-6 lg:p-8">
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">KYC Reviews</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {counts.pending} applications pending review
                </p>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["ALL", "pending", "approved", "rejected"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setTab(s)}
                        className={`p-4 rounded-xl border text-left transition-all ${tab === s
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-border bg-card hover:border-primary/40"
                            }`}
                    >
                        <p className="text-2xl font-display font-bold text-primary">
                            {counts[s]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{s}</p>
                    </button>
                ))}
            </div>

            <Card className="card-premium">
                <CardHeader className="pb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, Aadhaar or PAN…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {kycsLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Aadhaar</TableHead>
                                    <TableHead>PAN</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((k) => {
                                    const sc = statusConfig[k.status] ?? DEFAULT_STATUS;
                                    const Icon = sc.icon;
                                    return (
                                        <TableRow
                                            key={k._id}
                                            className="cursor-pointer hover:bg-muted/40"
                                            onClick={() => setSelected(k)}
                                        >
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {k.firstName} {k.lastName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {k.userId?.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {k.phone}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                •••• {k.documents?.aadhaar?.aadhaarLast4 ?? "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                •••••• {k.documents?.pan?.panLast4 ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {k.address?.city}, {k.address?.state}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                                                    <Icon className="h-3 w-3" />
                                                    {sc.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(k.createdAt).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell
                                                className="text-right"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {k.status === "pending" ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                                                            onClick={() => handleApprove(k)}
                                                            disabled={actionLoading}
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-rose-400 text-rose-600 hover:bg-rose-50"
                                                            onClick={() => { setSelected(k); setRejectModal(true); }}
                                                            disabled={actionLoading}
                                                        >
                                                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                                            No KYC applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Detail modal — click row to view */}
            {selected && !rejectModal && (
                <KycDetailModal
                    kyc={selected}
                    onClose={() => setSelected(null)}
                    onApprove={() => handleApprove(selected)}
                    onReject={() => setRejectModal(true)}
                    actionLoading={actionLoading}
                />
            )}

            {/* Reject modal */}
            <Dialog
                open={rejectModal}
                onOpenChange={(v) => { if (!v) { setRejectModal(false); setReason(""); } }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject KYC Application</DialogTitle>
                        <DialogDescription>
                            This reason will be visible to {selected?.firstName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label>Rejection Reason</Label>
                        <Textarea
                            placeholder="e.g. Document image is blurry, Aadhaar number doesn't match…"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setRejectModal(false); setReason(""); }}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={actionLoading || !reason.trim()}
                        >
                            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
        </div>
    );
};

export default AdminKycPage;