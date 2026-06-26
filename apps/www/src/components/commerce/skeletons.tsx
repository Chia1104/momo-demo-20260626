import { Skeleton } from "@heroui/react";

export function ProductCardSkeleton() {
  return (
    <div className="border-border bg-surface flex flex-col gap-2 rounded-md border p-2.5">
      <Skeleton className="aspect-square w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-6 w-1/2 rounded" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export { Skeleton };
