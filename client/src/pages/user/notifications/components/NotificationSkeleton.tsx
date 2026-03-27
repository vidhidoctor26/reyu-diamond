import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton = () => (
  <div className="space-y-2 p-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-4 rounded-xl">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export default NotificationSkeleton;
