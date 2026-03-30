import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AdListSkeleton = () => (
  <div className="grid gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-border/50">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AdListSkeleton;