import Link from "next/link"
import Image from "next/image"
import { Clock, User, ArrowRight } from "lucide-react"
import { Article } from "@/lib/data"
import { cn } from "@/lib/utils"

interface FeaturedCardProps {
    article: Article
    className?: string
}

export function FeaturedCard({ article, className }: FeaturedCardProps) {
    return (
        <Link
            href={`/article/${article.slug}`}
            className={cn(
                "group relative overflow-hidden rounded-3xl premium-glass transition-all duration-500 hover:premium-shadow-glow hover:-translate-y-1.5 hover:scale-[1.01] block",
                className
            )}
        >
            <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />
                <div className="absolute top-6 left-6">
                    <span className="premium-glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {article.category}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
                <div className="flex items-center space-x-4 mb-6 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                    <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2 opacity-50" />
                        {article.author || article.source || "NovaEdge Staff"}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-2 opacity-50" />
                        {article.readingTime}
                    </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight group-hover:text-white transition-colors duration-300 max-w-2xl">
                    {article.title}
                </h2>
                <p className="text-lg text-gray-400 line-clamp-2 max-w-xl leading-relaxed">
                    {article.summary}
                </p>
                <div className="mt-10">
                    <span className="inline-flex items-center px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                        Read Experience <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    )
}
