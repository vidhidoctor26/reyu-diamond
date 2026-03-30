import { motion } from "framer-motion";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdEmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Megaphone className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No advertisements yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        Start promoting your diamonds now!
      </p>
      <Button
          onClick={() => navigate("/user/advertisements/create")}
        className="mt-6 gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Your First Ad
      </Button>
    </motion.div>
  );
};

export default AdEmptyState;