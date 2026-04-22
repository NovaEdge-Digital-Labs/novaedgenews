import { Article, articles as localArticles } from "@/lib/data";
import { getLatestArticles, getTrendingArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import Trending from "@/components/Trending";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const { data: latestArticles = [] } = await getLatestArticles(1, 10);
  const trendingArticles = await getTrendingArticles(5);

  // Fallback to local data if API returns empty
  const heroArticle = latestArticles[0] || localArticles[0];
  const gridArticles = latestArticles.length > 1 ? latestArticles.slice(1, 10) : localArticles.slice(1, 10);
  const sidebarTrending = trendingArticles.length > 0 ? trendingArticles : localArticles.slice(0, 5);

  return (
    <div className="flex flex-col gap-12 pb-20 mt-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-[500px] rounded-3xl overflow-hidden group">
              <ArticleCard
                article={heroArticle}
                className="h-full border-0 shadow-none bg-transparent"
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <Trending articles={sidebarTrending} />
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdBanner slot="home-mid" className="h-32 premium-glass rounded-2xl" />
      </section>

      {/* Quick News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight">Quick News</h2>
          <Link href="/archive" className="text-sm font-bold text-primary flex items-center hover:translate-x-1 transition-transform">
            Browse All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article: Article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="premium-glass p-12 rounded-[3rem] text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tight mb-4 text-gradient">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto font-medium">
              Join 50,000+ professionals getting the latest high-signal tech updates directly in their inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
