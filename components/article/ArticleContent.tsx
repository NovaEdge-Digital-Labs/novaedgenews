"use client";

import Image from "next/image"
import { Clock, User, Calendar, Share2, Bookmark, MessageCircle } from "lucide-react"
import { Article } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import AdComponent from "@/components/ui/AdComponent"
import { useEffect } from "react"
import { trackView } from "@/lib/api"

interface ArticleContentProps {
    article: Article
}

export function ArticleContent({ article }: ArticleContentProps) {
    // Track article view
    useEffect(() => {
        if (article._id) {
            trackView(article._id);
        }
    }, [article._id]);

    const displayDate = article.date || article.publishedAt || "";

    return (
        <article className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <header className="mb-16 max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                            {article.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-12 leading-[1.05] tracking-tighter text-center">
                        {article.displayTitle || article.title}
                    </h1>

                    {/* Top Ad */}
                    <AdComponent slot={process.env.AD_SLOT_ARTICLE_TOP || "8888888888"} className="mb-12" />

                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground/60 font-bold border-y border-white/5 py-8">
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full mr-4 overflow-hidden border border-white/10 p-0.5">
                                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                                    {(article.author || article.source || "N").charAt(0)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-foreground font-black text-base">{article.author || article.source || "NovaEdge Staff"}</span>
                                <span className="text-[10px] uppercase tracking-wider">Lead Editor</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/5 mx-2 hidden md:block" />
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {displayDate ? formatDate(displayDate) : 'Recently'}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {article.readingTime}
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="relative aspect-21/10 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/5">
                        <Image
                            src={article.image}
                            alt={article.displayTitle || article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row justify-center gap-16 relative">
                    {/* Social Sidebar (Desktop) */}
                    <aside className="hidden lg:flex flex-col space-y-4 sticky top-40 h-fit -ml-24">
                        <button className="p-4 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10 group group-hover:-translate-y-1" aria-label="Bookmark">
                            <Bookmark className="h-5 w-5 group-hover:text-primary" />
                        </button>
                        <button className="p-4 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10 group group-hover:-translate-y-1" aria-label="Share">
                            <Share2 className="h-5 w-5 group-hover:text-primary" />
                        </button>
                        <button className="p-4 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10 group group-hover:-translate-y-1" aria-label="Comments">
                            <MessageCircle className="h-5 w-5 group-hover:text-primary" />
                        </button>
                    </aside>

                    {/* Article Body */}
                    <div className="max-w-prose">
                        <div
                            className="prose-premium"
                            dangerouslySetInnerHTML={{
                                __html: article.content
                                    ? article.content.replace(/\s\[\+\d+\schars\]/g, '') // Strips any NewsAPI truncation markers
                                    : ''
                            }}
                        />

                        {/* Bottom Ad */}
                        <AdComponent slot={process.env.AD_SLOT_ARTICLE_BOTTOM || "9999999999"} className="mt-16" />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-24 pt-12 border-t border-white/5 max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        {["#ArtificialIntelligence", "#TechTrends", "#Future", "#EdgeComputing"].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary border border-white/5 transition-all cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-3 font-black text-sm bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 group">
                            <Share2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            <span>Share Story</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
