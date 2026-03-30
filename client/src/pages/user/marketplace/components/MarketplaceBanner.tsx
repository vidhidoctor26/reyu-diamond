import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Advertisement } from "@/store/slices/advertisementSlice";

interface MarketplaceBannerProps {
  ads: Advertisement[];
}

const MarketplaceBanner = ({ ads }: MarketplaceBannerProps) => {
  const [current, setCurrent]       = useState(0);
  const [dismissed, setDismissed]   = useState(false);
  const [direction, setDirection]   = useState(1); // 1 = forward, -1 = backward

  const activeAds = ads.filter((ad) => {
    if (ad.status !== "APPROVED") return false;
    const now = new Date();
    if (ad.startDate && new Date(ad.startDate) > now) return false;
    if (ad.endDate   && new Date(ad.endDate)   < now) return false;
    return true;
  });

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % activeAds.length);
  }, [activeAds.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + activeAds.length) % activeAds.length);
  };

  // Auto-rotate every 5s
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [activeAds.length, next]);

  if (!activeAds.length || dismissed) return null;

  const ad = activeAds[current];

  const handleClick = () => {
    if (ad.ctaLink) {
      // track click via backend redirect
      window.open(ad.ctaLink, "_blank", "noopener,noreferrer");
    }
  };

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm">
      {/* Close */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 z-20 h-6 w-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <X className="h-3 w-3 text-white" />
      </button>

      {/* Slide */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={ad._id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative w-full h-36 sm:h-48 cursor-pointer"
          onClick={handleClick}
        >
          {/* Media */}
          {ad.mediaType === "video" ? (
            <video
              src={ad.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={ad.mediaUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <p className="text-white font-semibold text-sm sm:text-base truncate">
              {ad.title}
            </p>
            {ad.ctaLink && (
              <span className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                <ExternalLink className="h-3 w-3" />
                Visit now
              </span>
            )}
          </div>

          {/* Sponsored label */}
          <div className="absolute top-2 left-2 bg-black/40 rounded-full px-2 py-0.5">
            <span className="text-white text-[10px] font-medium">Sponsored</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation — only if multiple ads */}
      {activeAds.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 h-7 w-7 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {activeAds.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketplaceBanner;