import { Skeleton } from "@/components/ui/Skeleton"

export default function ArticleSkeleton() {
    return (
        <div className="py-12 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                </div>
                <Skeleton className="aspect-[21/10] w-full rounded-3xl mb-12" />
                <div className="space-y-6">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/6" />
                </div>
            </div>
        </div>
    )
}
