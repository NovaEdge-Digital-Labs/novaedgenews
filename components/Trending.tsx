'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Article } from '@/lib/data';
import { useTracking } from '@/lib/hooks';

interface TrendingProps {
    articles: Article[];
}

export default function Trending({ articles }: TrendingProps) {
    const { trackArticleClick } = useTracking();

    return (
        <div className="premium-glass rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold tracking-tight">Trending Now</h2>
            </div>

            <div className="space-y-6">
                {articles.slice(0, 5).map((article, index) => (
                    <div key={article.id} className="group relative flex items-start space-x-4">
                        <span className="text-3xl font-black text-muted/30 group-hover:text-primary/20 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                                {article.category}
                            </p>
                            <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors">
                                <Link
                                    href={`/articles/${article.slug}`}
                                    onClick={() => trackArticleClick(article.id, `/articles/${article.slug}`)}
                                >
                                    {article.title}
                                </Link>
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                href="/trending"
                className="block mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
                View All Trending
            </Link>
        </div>
    );
}
