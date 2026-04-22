'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Article } from '@/lib/data';
import { useTracking } from '@/lib/hooks';
import { useEffect } from 'react';
import { trackImpression } from '@/lib/api';

interface ArticleCardProps {
    article: Article;
    className?: string;
}

export default function ArticleCard({ article, className }: ArticleCardProps) {
    const { trackArticleClick } = useTracking();

    const displayTitle = article.displayTitle || article.title;
    const variant = article.variant;

    useEffect(() => {
        if (variant && (article.id || article._id)) {
            trackImpression(article.id || article._id!, variant);
        }
    }, [article.id, article._id, variant]);

    return (
        <div
            className={cn(
                "group relative flex flex-col premium-glass rounded-2xl overflow-hidden hover:premium-shadow-glow transition-all duration-500",
                className
            )}
        >
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={article.image}
                    alt={displayTitle || article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-60" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full">
                        {article.category}
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
                    <span>{article.author}</span>
                    <span>•</span>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readingTime}
                    </div>
                </div>

                <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                    <Link
                        href={`/articles/${article.slug}`}
                        onClick={() => trackArticleClick(article.id, `/articles/${article.slug}`, variant || undefined)}
                    >
                        {displayTitle}
                    </Link>
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {article.summary}
                </p>

                <Link
                    href={`/articles/${article.slug}`}
                    onClick={() => trackArticleClick(article.id, `/articles/${article.slug}`, variant || undefined)}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:translate-x-2 transition-transform"
                >
                    Read Full Story <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
