"use client";

import Link from "next/link"
import Image from "next/image"
import { Bookmark, MessageCircle } from "lucide-react"
import { Article } from "@/lib/data"
import { cn, formatDate } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { trackImpression, trackClick } from "@/lib/api"

interface NewsCardProps {
    article: Article
    className?: string
    layout?: "horizontal" | "vertical"
}

export function NewsCard({ article, className, layout = "vertical" }: NewsCardProps) {
    const isHorizontal = layout === "horizontal"
    const cardRef = useRef<HTMLAnchorElement>(null)
    const tracked = useRef(false)

    useEffect(() => {
        if (!article._id || !article.variant) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !tracked.current) {
                    tracked.current = true
                    trackImpression(article._id!, article.variant!)
                }
            },
            { threshold: 0.5 }
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [article._id, article.variant])

    const handleClick = () => {
        if (article._id && article.variant) {
            trackClick(article._id, article.variant)
        }
    }

    return (
        <Link
            ref={cardRef}
            href={`/article/${article.slug}`}
            onClick={handleClick}
            className={cn(
                "group transition-all duration-500 block h-full",
                isHorizontal
                    ? "flex space-x-8 py-8 border-b border-white/5 last:border-0 hover:bg-white/2 -mx-4 px-4 rounded-3xl"
                    : "premium-glass rounded-2xl p-5 hover:premium-shadow-glow hover:-translate-y-1.5 hover:scale-[1.02]",
                className
            )}
        >
            <div className={cn(
                "relative overflow-hidden rounded-xl shrink-0 bg-white/5",
                isHorizontal ? "w-32 h-32 md:w-56 md:h-40" : "aspect-video mb-6"
            )}>
                <Image
                    src={article.image}
                    alt={article.displayTitle || article.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617]/80 to-transparent opacity-60" />
            </div>

            <div className="flex flex-col grow">
                <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                        {article.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-700" />
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide" suppressHydrationWarning>
                        {article.date ? formatDate(article.date) : article.publishedAt ? formatDate(article.publishedAt) : ''}
                    </span>
                </div>

                <h3 className={cn(
                    "font-bold leading-tight group-hover:text-white transition-colors duration-300",
                    isHorizontal ? "text-xl md:text-2xl line-clamp-2" : "text-[19px] line-clamp-2"
                )}>
                    {article.displayTitle || article.title}
                </h3>

                {!isHorizontal && (
                    <p className="mt-3 text-[14px] text-gray-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                    </p>
                )}

                <div className="mt-8 pt-5 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-blue-600/20 border border-white/10" />
                        <span className="text-[11px] font-medium text-gray-400">{article.author || article.source || "NovaEdge Staff"}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-400 transition-all opacity-40 group-hover:opacity-100">
                        <Bookmark className="h-4 w-4" />
                        <MessageCircle className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
