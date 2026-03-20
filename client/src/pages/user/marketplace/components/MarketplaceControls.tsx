import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Grid, List, ArrowUpDown, SlidersHorizontal, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

/* ─── Constants ─── */
const SHAPES    = ["Round", "Princess", "Emerald", "Oval", "Cushion", "Pear", "Marquise", "Heart", "Radiant", "Asscher"];
const COLORS    = ["D", "E", "F", "G", "H", "I", "J", "K"];
const CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const CUTS      = ["Excellent", "Very Good", "Good", "Fair"];

export interface FilterState {
  priceRange: [number, number];
  caratRange: [number, number];
  selectedShapes: string[];
  selectedColors: string[];
  selectedClarities: string[];
  selectedCuts: string[];
}

export const defaultFilters: FilterState = {
  priceRange: [0, 100000000],
  caratRange: [0, 10],
  selectedShapes: [],
  selectedColors: [],
  selectedClarities: [],
  selectedCuts: [],
};

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  appliedFilters: FilterState;
  onApplyFilters: (f: FilterState) => void;
  onClearFilters: () => void;
}

const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
    }`}
  >
    {label}
  </button>
);

const MarketplaceControls = ({
  searchQuery, setSearchQuery,
  sortBy, setSortBy,
  viewMode, setViewMode,
  appliedFilters, onApplyFilters, onClearFilters,
}: Props) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, setPending] = useState<FilterState>(defaultFilters);

  const handleOpenChange = (open: boolean) => {
    if (open) setPending(appliedFilters);
    setSheetOpen(open);
  };

  const toggleItem = (key: keyof FilterState, value: string) =>
    setPending((p) => {
      const arr = p[key] as string[];
      return { ...p, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });

  const handleApply = () => {
    onApplyFilters(pending);
    setSheetOpen(false);
  };

  const activeCount =
    (appliedFilters.selectedShapes.length    > 0 ? 1 : 0) +
    (appliedFilters.selectedColors.length    > 0 ? 1 : 0) +
    (appliedFilters.selectedClarities.length > 0 ? 1 : 0) +
    (appliedFilters.selectedCuts.length      > 0 ? 1 : 0) +
    (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 100000 ? 1 : 0) +
    (appliedFilters.caratRange[0] > 0 || appliedFilters.caratRange[1] < 10     ? 1 : 0);

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-2">Marketplace</h1>
        <p className="text-muted-foreground">Browse certified diamonds from verified traders worldwide</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by shape, carat, color..." className="pl-12 h-12 rounded-xl" />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-12 w-[190px] rounded-xl">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low → High</SelectItem>
            <SelectItem value="price-high">Price: High → Low</SelectItem>
            <SelectItem value="carat-high">Carat: High → Low</SelectItem>
            <SelectItem value="carat-low">Carat: Low → High</SelectItem>
            <SelectItem value="most-bids">Most Bids</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Sheet */}
        <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 rounded-xl relative">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">Filter Diamonds</SheetTitle>
              <SheetDescription>Refine your search with advanced filters</SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8">
              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Price Range</Label>
                <Slider
  value={pending.priceRange}
  onValueChange={(v) => setPending((p) => ({ ...p, priceRange: v as [number, number] }))}
  min={0} max={1000000} step={100000} // ← was 100000
/>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${pending.priceRange[0].toLocaleString()}</span>
                  <span>${pending.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Carat Range */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Carat Weight</Label>
                <Slider value={pending.caratRange}
                  onValueChange={(v) => setPending((p) => ({ ...p, caratRange: v as [number, number] }))}
                  min={0} max={10} step={0.1} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{pending.caratRange[0].toFixed(1)} ct</span>
                  <span>{pending.caratRange[1].toFixed(1)} ct</span>
                </div>
              </div>

              {/* Shape */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Shape</Label>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map((s) => (
                    <Pill key={s} label={s} active={pending.selectedShapes.includes(s)}
                      onClick={() => toggleItem("selectedShapes", s)} />
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Color</Label>
                  <span className="text-xs text-muted-foreground">D (colorless) → K (faint)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <Pill key={c} label={c} active={pending.selectedColors.includes(c)}
                      onClick={() => toggleItem("selectedColors", c)} />
                  ))}
                </div>
              </div>

              {/* Clarity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Clarity</Label>
                  <span className="text-xs text-muted-foreground">IF (best) → SI2</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CLARITIES.map((c) => (
                    <Pill key={c} label={c} active={pending.selectedClarities.includes(c)}
                      onClick={() => toggleItem("selectedClarities", c)} />
                  ))}
                </div>
              </div>

              {/* Cut */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Cut</Label>
                <div className="flex flex-wrap gap-2">
                  {CUTS.map((c) => (
                    <Pill key={c} label={c} active={pending.selectedCuts.includes(c)}
                      onClick={() => toggleItem("selectedCuts", c)} />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setPending(defaultFilters)}>
                  <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
                <Button className="btn-premium text-primary-foreground flex-1" onClick={handleApply}>
                  Apply Filters
                  {activeCount > 0 && (
                    <Badge className="ml-2 bg-primary-foreground/20 text-primary-foreground border-0">
                      {activeCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* View Toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button onClick={() => setViewMode("grid")}
            className={`p-3 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            <Grid className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode("list")}
            className={`p-3 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            <List className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Active filter pills */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {appliedFilters.selectedShapes.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 cursor-pointer pr-1.5"
              onClick={() => onApplyFilters({ ...appliedFilters, selectedShapes: appliedFilters.selectedShapes.filter((x) => x !== s) })}>
              {s} <X className="h-3 w-3" />
            </Badge>
          ))}
          {appliedFilters.selectedColors.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 cursor-pointer pr-1.5"
              onClick={() => onApplyFilters({ ...appliedFilters, selectedColors: appliedFilters.selectedColors.filter((x) => x !== c) })}>
              Color {c} <X className="h-3 w-3" />
            </Badge>
          ))}
          {appliedFilters.selectedClarities.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 cursor-pointer pr-1.5"
              onClick={() => onApplyFilters({ ...appliedFilters, selectedClarities: appliedFilters.selectedClarities.filter((x) => x !== c) })}>
              {c} <X className="h-3 w-3" />
            </Badge>
          ))}
          {appliedFilters.selectedCuts.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 cursor-pointer pr-1.5"
              onClick={() => onApplyFilters({ ...appliedFilters, selectedCuts: appliedFilters.selectedCuts.filter((x) => x !== c) })}>
              {c} <X className="h-3 w-3" />
            </Badge>
          ))}
          <button onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 ml-1">
            Clear all
          </button>
        </div>
      )}
    </>
  );
};

export default MarketplaceControls;