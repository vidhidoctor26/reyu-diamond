import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 className="text-4xl font-display font-bold text-primary">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your diamonds
        </p>
      </div>

      <Button className="btn-premium">
        <Sparkles className="h-4 w-4 mr-2" />
        Add New Diamond
      </Button>
    </motion.div>
  );
};

export default Header;
