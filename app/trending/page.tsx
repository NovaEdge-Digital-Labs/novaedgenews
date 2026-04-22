import { getTrendingArticles } from "@/lib/api";
import { Article, articles as localArticles } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";
import { Sparkles, TrendingUp } from "lucide-react";

export const revalidate = 21600; // Refresh every 6 hours

export default async function TrendingPage() {
    const trendingArticles = await getTrendingArticles(50);

    // Use mixed data if API returns less than 50
    const displayArticles = trendingArticles.length > 0 ? trendingArticles : localArticles.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <header className="flex flex-col items-center text-center gap-6 mb-20">
                <div className="flex items-center gap-3 text-primary">
                    <TrendingUp className="w-8 h-8" />
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic">The Velocity List</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl font-medium">
                    The top 50 high-signal shifts in technology, AI, and global markets, refreshed every 6 hours by NovaEdge intelligence.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayArticles.map((article: Article, index: number) => (
                    <div key={article.id} className="relative">
                        <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center bg-background border border-border rounded-full z-10 font-black text-xl italic text-primary premium-shadow-glow">
                            #{index + 1}
                        </div>
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>

            <section className="mt-20">
                <AdBanner slot="trending-footer" className="h-48 bg-white/5 rounded-[3rem]" />
            </section>

            <div className="mt-20 p-12 premium-glass rounded-[3rem] text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-black mb-4">Quality Over Noise</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Our trending algorithm prioritizes depth and long-term signal over clickbait. We track CTR, reading time, and social sentiment to surface what truly matters.
                </p>
            </div>
        </div>
    );
}
