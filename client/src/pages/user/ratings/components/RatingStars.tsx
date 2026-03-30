import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const RatingStars = ({ value, onChange, size = "md", readOnly = false }: RatingStarsProps) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1" onMouseLeave={() => !readOnly && setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onClick={() => onChange?.(star)}
            className={cn(
              "transition-transform duration-150",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors duration-150",
                star <= display
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-border"
              )}
            />
          </button>
        ))}
      </div>

      {!readOnly && display > 0 && (
        <span className="text-xs text-muted-foreground font-medium">
          {labels[display]}
        </span>
      )}
    </div>
  );
};

export default RatingStars;