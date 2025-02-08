import { Skeleton } from "@/components/ui/skeleton"

export function SongSkeleton() {
  return (
    <div className="p-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center flex-1 gap-2">
        <Skeleton className="h-6 w-6 rounded bg-gray-400" />
        <div>
          <Skeleton className="h-4 w-32 mb-2 bg-gray-400" />
          <Skeleton className="h-3 w-20 bg-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded bg-gray-400" />
        <Skeleton className="h-8 w-8 rounded bg-gray-400" />
      </div>
    </div>
  );
} 
