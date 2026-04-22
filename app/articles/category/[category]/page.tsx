import { getArticlesByCategory, getTrendingArticles } from "@/lib/api";
import { Article, articles as localArticles, categories } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import Trending from "@/components/Trending";
import AdBanner from "@/components/AdBanner";
import { ArrowLeft, Filter, SortDesc } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: { category: string },
    searchParams: { page?: string, sort?: string }
}) {
    const page = parseInt(searchParams.page || '1');
    const categorySlug = params.category;
    const category = categories.find(c => c.slug === categorySlug);

    if (!category) {
        notFound();
    }

    const { articles, totalPages } = await getArticlesByCategory(categorySlug, page, 12);
    const trendingArticles = await getTrendingArticles(5);

    // Fallback
    const displayArticles = articles.length > 0 ? articles : localArticles.filter(a => a.category.toLowerCase().includes(categorySlug));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <header className="flex flex-col gap-6 mb-12">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Home
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Intelligence Stream</span>
                        <h1 className="text-5xl font-black tracking-tighter uppercase">{category.name}</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
                            <Filter className="w-3 h-3" /> Filter
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
                            <SortDesc className="w-3 h-3" /> Sort: Newest
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 flex flex-col gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {displayArticles.map((article: Article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/articles/category/${categorySlug}?page=${i + 1}`}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-border font-bold transition-all ${page === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-white/5'
                                        }`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-12">
                    <Trending articles={trendingArticles.length > 0 ? trendingArticles : localArticles.slice(0, 5)} />
                    <AdBanner slot="category-sidebar" className="h-96 bg-white/5 rounded-2xl" />
                </aside>
            </div>
        </div>
    );
}
