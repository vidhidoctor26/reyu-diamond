import { useState, useEffect , useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Diamond, Pencil, Trash2, Search } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

/* ── Types ─────────────────────────────────────── */

interface Preference {
  id: string;
  shape: string;
  caratMin: number;
  caratMax: number;
  color: string;
  clarity: string;
  budgetMin: number;
  budgetMax: number;
  certification: string;
  createdAt: string;
}

/* ── Mock seed data ────────────────────────────── */

const SEED: Preference[] = [
  {
    id: "1",
    shape: "Round",
    caratMin: 1,
    caratMax: 2.5,
    color: "D",
    clarity: "VVS1",
    budgetMin: 5000,
    budgetMax: 25000,
    certification: "GIA",
    createdAt: "2026-02-10T10:30:00Z",
  },
  {
    id: "2",
    shape: "Oval",
    caratMin: 0.8,
    caratMax: 1.5,
    color: "F",
    clarity: "VS1",
    budgetMin: 3000,
    budgetMax: 15000,
    certification: "IGI",
    createdAt: "2026-02-12T14:15:00Z",
  },
];

/* ── Page Component ────────────────────────────── */

const Preferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = () => navigate("/user/preferences/new");

  const handleEdit = (p: Preference) => {
    // Store form data in sessionStorage for the edit page to pick up
    sessionStorage.setItem(
      `pref_edit_${p.id}`,
      JSON.stringify({
        shape: p.shape,
        caratMin: p.caratMin,
        caratMax: p.caratMax,
        color: p.color,
        clarity: p.clarity,
        budgetMin: p.budgetMin,
        budgetMax: p.budgetMax,
        certification: p.certification,
      }),
    );
    navigate(`/user/preferences/${p.id}/edit`);
  };

useEffect(() => {
  api.get("/requirements").then((res) => {
    const mapped = res.data.data.map((r: any) => ({
      id: r._id,
      shape: r.intent.shape?.[0],
      caratMin: r.intent.carat.min,
      caratMax: r.intent.carat.max,
      color: r.intent.color?.[0],
      clarity: r.intent.clarity?.[0],
      budgetMin: r.constraints.budget,
      budgetMax: r.constraints.budget,
      certification: r.preferences?.certificate?.[0] || "—",
      createdAt: r.createdAt,
    }));

    setPreferences(mapped);
  });
}, []);

const handleDelete = useCallback(async () => {
  if (!deleteId) return;

  try {
    await api.delete(`/requirements/${deleteId}`);

    setPreferences((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);

    toast({
      title: "Deleted",
      description: "Requirement removed successfully",
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.response?.data?.message || "Delete failed",
      variant: "destructive",
    });
  }
}, [deleteId]);



  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                My Preferences
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage your diamond requirements to receive tailored
                recommendations.
              </p>
            </div>

            <Button onClick={handleCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Create Preference
            </Button>
          </div>
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : preferences.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {preferences.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <PreferenceCard
                    preference={p}
                    onEdit={() => handleEdit(p)}
                    onDelete={() => setDeleteId(p.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Preference
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this requirement. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
};

/* ── Sub-components ────────────────────────────── */

const PreferenceCard = ({
  preference: p,
  onEdit,
  onDelete,
}: {
  preference: Preference;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl shadow-soft border-border/60">
    <div className="flex items-start gap-4 min-w-0">
      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Diamond className="h-5 w-5 text-accent" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-sm text-foreground">{p.shape}</span>
          <Badge variant="secondary" className="text-[11px] font-normal">
            {p.caratMin}–{p.caratMax} ct
          </Badge>
          <Badge variant="secondary" className="text-[11px] font-normal">
            {p.color} · {p.clarity}
          </Badge>
          <Badge variant="outline" className="text-[11px] font-normal">
            {p.certification}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ${p.budgetMin.toLocaleString()} – ${p.budgetMax.toLocaleString()} ·
          Created{" "}
          {new Date(p.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </Card>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
      <Search className="h-7 w-7 text-muted-foreground" />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
      No preferences yet
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
      Create your first diamond requirement and we'll match listings that fit
      your criteria.
    </p>
    <Button onClick={onCreate} className="gap-2">
      <Plus className="h-4 w-4" />
      Create Preference
    </Button>
  </motion.div>
);

export default Preferences;
