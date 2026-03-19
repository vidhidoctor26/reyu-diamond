import { motion } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ FIXED: No frontend business logic
export const getDisplayStatus = (auction: any) => {
  if (auction.status === "cancelled") return "Cancelled";

  if (auction.status === "ended") {
    return auction.locked ? "Deal Created" : "Ended";
  }

  if (auction.status === "active") return "Active";

  return "Upcoming";
};

const ListingsFilters = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-6"
  >
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        {/* ✅ FIXED: Correct mapping */}
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="pl-12 h-11 rounded-xl"
            />
          </div>

          {/* Sort */}
          <Select defaultValue="newest">
            <SelectTrigger className="w-[150px] h-11 rounded-xl">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-high">Price ↓</SelectItem>
              <SelectItem value="price-low">Price ↑</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </Tabs>
  </motion.div>
);

export default ListingsFilters;