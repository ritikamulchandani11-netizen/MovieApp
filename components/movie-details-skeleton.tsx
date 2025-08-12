import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MovieDetailsSkeleton() {
  return (
    <div className="relative">
      {/* Backdrop skeleton */}
      <div className="h-[50vh] md:h-[60vh]">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster skeleton */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <Skeleton className="aspect-[2/3] w-full" />
            </Card>
          </div>

          {/* Movie info skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />

              <div className="flex gap-4 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>

              <div className="flex gap-2 mb-6">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>

              <Skeleton className="h-10 w-40 mb-6" />
            </div>

            <div>
              <Skeleton className="h-8 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Cast skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[2/3] w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
