import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-card border border-border">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-56 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-40 mx-auto sm:mx-0" />
      </div>
    </div>

    {/* Badges skeleton */}
    <div className="flex gap-2">
      <Skeleton className="h-7 w-28 rounded-full" />
      <Skeleton className="h-7 w-32 rounded-full" />
      <Skeleton className="h-7 w-28 rounded-full" />
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
