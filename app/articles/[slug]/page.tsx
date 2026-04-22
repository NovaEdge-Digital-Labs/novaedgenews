import { getArticleBySlug, getTrendingArticles } from "@/lib/api";
import { articles as localArticles } from "@/lib/data";
import Navigation from "@/components/Navigation";
import Trending from "@/components/Trending";
import AdBanner from "@/components/AdBanner";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, ArrowLeft, X, Send, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    if (!article || !article.seo) return {};

    return {
        title: article.seo.metaTitle,
        description: article.seo.metaDescription,
        keywords: article.seo.metaKeywords,
        alternates: {
            canonical: article.seo.canonical,
        },
        openGraph: {
            title: article.seo.og?.title,
            description: article.seo.og?.description,
            images: article.seo.og?.image ? [{ url: article.seo.og.image }] : [],
            url: article.seo.og?.url,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.seo.twitter?.title,
            description: article.seo.twitter?.description,
            images: article.seo.twitter?.image ? [article.seo.twitter.image] : [],
        },
    };
}

import ArticleTracker from "@/components/ArticleTracker";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug) || localArticles.find(a => a.slug === params.slug);
    const trendingArticles = await getTrendingArticles(5);

    if (!article) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(article.seo?.schema || {
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": article.headline || article.title,
                        "image": [article.mainImage || article.image],
                        "datePublished": (article.publishedAt || article.date ? new Date(article.publishedAt || article.date).toISOString() : new Date().toISOString()),
                        "dateModified": (article.seo?.updatedAt ? new Date(article.seo.updatedAt).toISOString() : new Date().toISOString()),
                        "author": [{
                            "@type": "Person",
                            "name": article.author || process.env.NEXT_PUBLIC_SITE_NAME || "NovaEdge News"
                        }],
                        "publisher": {
                            "@type": "Organization",
                            "name": process.env.NEXT_PUBLIC_SITE_NAME || "NovaEdge News",
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech'}/logo.png`
                            }
                        },
                        "description": article.summary,
                        "articleBody": article.content,
                        "keywords": article.seo?.metaKeywords?.join(", ") || "",
                        "mainEntity": {
                            "@type": "NewsArticle",
                            "name": article.headline || article.title
                        }
                    })
                }}
            />
            <ArticleTracker article={article} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <article className="lg:col-span-8 flex flex-col gap-8">
                        <header className="flex flex-col gap-6">
                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full w-fit">
                                {article.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-bold text-foreground">By {article.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{article.readingTime}</span>
                                </div>
                                <div className="h-4 w-px bg-border hidden sm:block" />
                                <span>Published on {new Date(article.date).toLocaleDateString()}</span>
                            </div>
                        </header>

                        <div className="relative aspect-video rounded-3xl overflow-hidden premium-shadow-glow">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <AdBanner slot="article-top" className="h-24 bg-white/5 rounded-2xl" />

                        <div
                            className="prose prose-invert prose-premium max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        <AdBanner slot="article-mid" className="h-64 bg-white/5 rounded-2xl" />

                        {/* Share & Source */}
                        <footer className="mt-12 flex flex-col gap-8 border-t border-border pt-12">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold uppercase tracking-widest">Share this story</span>
                                    <div className="flex gap-2">
                                        <button className="p-3 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button className="p-3 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Send className="w-4 h-4" />
                                        </button>
                                        <button className="p-3 rounded-full bg-white/5 hover:bg-primary/20 transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {article.source && (
                                    <Link
                                        href={article.source}
                                        target="_blank"
                                        className="text-xs font-bold uppercase tracking-widest text-primary underline underline-offset-8"
                                    >
                                        Source: {new URL(article.source).hostname}
                                    </Link>
                                )}
                            </div>
                        </footer>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-12">
                        <div className="sticky top-32 flex flex-col gap-12 text-foreground">
                            <Trending articles={trendingArticles.length > 0 ? trendingArticles : localArticles.slice(0, 5)} />
                            <div className="premium-glass p-8 rounded-3xl">
                                <h3 className="text-lg font-bold mb-4">Related Intelligence</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Deep analysis on {article.category} is published every Tuesday. Stay tuned for our next briefing.
                                </p>
                            </div>
                            <AdBanner slot="article-sidebar" className="h-96 bg-white/5 rounded-2xl" />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
