import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import {
  Search, Loader2, CheckCircle2, XCircle,
  Ban, MousePointerClick, Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AdminAd } from "@/store/slices/adminSlice";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING:  { label: "Pending",  color: "border-amber-400  text-amber-600  bg-amber-50  dark:bg-amber-900/20"  },
  APPROVED: { label: "Approved", color: "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  REJECTED: { label: "Rejected", color: "border-rose-400   text-rose-600   bg-rose-50   dark:bg-rose-900/20"   },
  DISABLED: { label: "Disabled", color: "border-slate-400  text-slate-500  bg-slate-50  dark:bg-slate-800/20"  },
};

const AdminAds = () => {
  const dispatch = useAppDispatch();
  const { ads, adsLoading, actionLoading } = useAppSelector((s) => s.admin);

  const [search,      setSearch]      = useState("");
  const [tab,         setTab]         = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "DISABLED">("ALL");
  const [previewAd,   setPreviewAd]   = useState<AdminAd | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [targetAd,    setTargetAd]    = useState<AdminAd | null>(null);
  const [reason,      setReason]      = useState("");

  useEffect(() => {
    dispatch(adminActions.fetchAdsRequest());
  }, [dispatch]);

  const counts = {
    ALL:      ads.length,
    PENDING:  ads.filter((a) => a.status === "PENDING").length,
    APPROVED: ads.filter((a) => a.status === "APPROVED").length,
    REJECTED: ads.filter((a) => a.status === "REJECTED").length,
    DISABLED: ads.filter((a) => a.status === "DISABLED").length,
  };

  const filtered = ads.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.advertiserId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "ALL" || a.status === tab;
    return matchSearch && matchTab;
  });

  const handleAction = (ad: AdminAd, action: "APPROVE" | "REJECT" | "DISABLE") => {
    if (action === "REJECT") {
      setTargetAd(ad);
      setRejectModal(true);
      return;
    }
    dispatch(adminActions.updateAdStatusRequest({ adId: ad._id, action }));
  };

  const handleReject = () => {
    if (!targetAd) return;
    dispatch(adminActions.updateAdStatusRequest({
      adId: targetAd._id,
      action: "REJECT",
      rejectionReason: reason,
    }));
    setRejectModal(false);
    setTargetAd(null);
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
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Advertisements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {counts.PENDING} pending approval
        </p>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["ALL", "PENDING", "APPROVED", "REJECTED", "DISABLED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`p-4 rounded-xl border text-left transition-all ${
              tab === s
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <p className="text-2xl font-display font-bold text-primary">{counts[s]}</p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{s.toLowerCase()}</p>
          </button>
        ))}
      </div>

      <Card className="card-premium">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or advertiser…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {adsLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Advertiser</TableHead>
                  <TableHead>Placements</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ad) => {
                  const sc = statusConfig[ad.status];
                  return (
                    <TableRow key={ad._id}>
                      <TableCell>
                        <button
                          onClick={() => setPreviewAd(ad)}
                          className="w-14 h-10 rounded-lg border bg-muted flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/30 transition"
                        >
                          {ad.mediaType === "image" ? (
                            <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium max-w-[160px] truncate">{ad.title}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{ad.advertiserId?.name}</p>
                          <p className="text-xs text-muted-foreground">{ad.advertiserId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ad.bannerSection.slice(0, 2).map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                              {s}
                            </Badge>
                          ))}
                          {ad.bannerSection.length > 2 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              +{ad.bannerSection.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground" />
                          {ad.clicks.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ad.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ad.status === "PENDING" && (
                            <>
                              <Button size="sm" variant="outline"
                                className="border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleAction(ad, "APPROVE")}
                                disabled={actionLoading}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline"
                                className="border-rose-400 text-rose-600 hover:bg-rose-50"
                                onClick={() => handleAction(ad, "REJECT")}
                                disabled={actionLoading}>
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                          {ad.status === "APPROVED" && (
                            <Button size="sm" variant="outline"
                              className="border-slate-400 text-slate-500 hover:bg-slate-50"
                              onClick={() => handleAction(ad, "DISABLE")}
                              disabled={actionLoading}>
                              <Ban className="h-3.5 w-3.5 mr-1" /> Disable
                            </Button>
                          )}
                          {(ad.status === "REJECTED" || ad.status === "DISABLED") && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                      No advertisements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Preview modal */}
      <Dialog open={!!previewAd} onOpenChange={(v) => !v && setPreviewAd(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewAd?.title}</DialogTitle>
            <DialogDescription>
              By {previewAd?.advertiserId?.name} · {previewAd?.mediaType}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border bg-muted">
            {previewAd?.mediaType === "image" ? (
              <img src={previewAd.mediaUrl} alt={previewAd.title} className="w-full object-contain max-h-64" />
            ) : previewAd?.mediaType === "video" ? (
              <video src={previewAd.mediaUrl} controls className="w-full max-h-64" />
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {previewAd?.bannerSection.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject modal */}
      <Dialog open={rejectModal} onOpenChange={(v) => { if (!v) { setRejectModal(false); setReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogDescription>Provide a reason for rejection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Rejection Reason</Label>
            <Textarea
              placeholder="e.g. Content violates platform guidelines…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectModal(false); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !reason.trim()}>
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

export default AdminAds;