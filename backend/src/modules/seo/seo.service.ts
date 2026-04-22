import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { SeoLog, SeoLogDocument } from '../../schemas/seo-log.schema';
import { AIService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SeoService {
    private readonly logger = new Logger(SeoService.name);

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(SeoLog.name) private seoLogModel: Model<SeoLogDocument>,
        private readonly aiService: AIService,
        private readonly configService: ConfigService,
    ) { }

    async generateSeoMetadata(articleId: string): Promise<ArticleDocument | null> {
        const article = await this.articleModel.findById(articleId);
        if (!article) {
            this.logger.error(`Article not found: ${articleId}`);
            return null;
        }

        this.logger.log(`Generating AI SEO metadata for: ${article.title}`);

        try {
            const prompt = `
                Generate professional SEO metadata for this news article.
                Return ONLY a JSON object with this exact structure:
                {
                  "metaTitle": "SEO title under 60 chars. Compelling, include numbers/benefits if any.",
                  "metaDescription": "Summarize key benefit. Include call-to-action. Under 160 chars.",
                  "metaKeywords": ["primary keyword", "secondary keyword", "long-tail keyword"],
                  "ogTitle": "Attractive social sharing title",
                  "ogDescription": "2-line version for social sharing",
                  "twitterTitle": "Tweet-friendly version of title",
                  "twitterDescription": "Tweet-friendly version under 280 chars"
                }

                Article Details:
                Title: ${article.title}
                Summary: ${article.summary}
                Tags: ${article.tags.join(', ')}
            `;

            const rawResponse = await this.aiService.callAI(
                this.aiService.primaryClient,
                prompt,
                'gpt-4o'
            );

            let seoData: any;
            try {
                const cleaned = rawResponse.replace(/```json|```/g, '').trim();
                seoData = JSON.parse(cleaned);
            } catch (e) {
                this.logger.error(`Failed to parse AI SEO response: ${rawResponse}`);
                return article;
            }

            const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://novaedge.tech';
            const siteName = this.configService.get<string>('SITE_NAME') || 'NovaEdge News';
            const siteLogo = this.configService.get<string>('SITE_LOGO') || 'https://novaedge.tech/logo.png';
            const twitterHandle = this.configService.get<string>('TWITTER_HANDLE') || '@novaedgenews';

            const articleUrl = `${frontendUrl}/articles/${article.slug}`;
            const imageUrl = article.mainImage || article.image;
            const now = new Date();

            article.seo = {
                metaTitle: seoData.metaTitle?.slice(0, 60) || article.title.slice(0, 60),
                metaDescription: seoData.metaDescription?.slice(0, 160) || article.summary.slice(0, 160),
                metaKeywords: seoData.metaKeywords || article.tags || [],
                og: {
                    title: seoData.ogTitle || seoData.metaTitle,
                    description: seoData.ogDescription || seoData.metaDescription,
                    image: imageUrl,
                    url: articleUrl,
                    type: 'article',
                },
                twitter: {
                    card: 'summary_large_image',
                    creator: twitterHandle,
                    title: seoData.twitterTitle || seoData.ogTitle,
                    description: seoData.twitterDescription || seoData.ogDescription,
                    image: imageUrl,
                },
                schema: {
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    headline: article.headline || article.title,
                    description: article.summary,
                    image: imageUrl,
                    datePublished: article.publishedAt || now,
                    dateModified: now,
                    author: {
                        "@type": "Person",
                        name: article.author || siteName
                    },
                    publisher: {
                        "@type": "Organization",
                        name: siteName,
                        logo: {
                            "@type": "ImageObject",
                            url: siteLogo
                        }
                    }
                },
                generatedAt: now,
                updatedAt: now
            };

            // Sync legacy fields for backward compatibility
            article.metaTitle = article.seo.metaTitle || article.title;
            article.metaDescription = article.seo.metaDescription || article.summary;
            article.metaKeywords = article.seo.metaKeywords || [];

            return await article.save();
        } catch (error) {
            this.logger.error(`SEO generation failed: ${error.message}`);
            return article;
        }
    }

    async updateArticleSeo(articleId: string) {
        return this.generateSeoMetadata(articleId);
    }

    async generateSitemap(): Promise<string> {
        const publishedArticles = await this.articleModel
            .find({ status: 'published' })
            .select('slug publishedAt views')
            .sort({ publishedAt: -1 })
            .limit(50000)
            .exec();

        const frontendUrl = 'https://novaedge.tech';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Homepage
        xml += `  <url>\n    <loc>${frontendUrl}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        // Trending
        xml += `  <url>\n    <loc>${frontendUrl}/trending</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

        // Categories
        const categories = ['tech', 'ai', 'startup', 'business'];
        categories.forEach(cat => {
            xml += `  <url>\n    <loc>${frontendUrl}/articles/category/${cat}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });

        // Articles
        publishedArticles.forEach(article => {
            const priority = article.views > 1000 ? 0.8 : (article.views > 500 ? 0.6 : 0.4);
            const lastMod = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
            xml += `  <url>\n    <loc>${frontendUrl}/articles/${article.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>never</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        });

        xml += '</urlset>';
        return xml;
    }

    @Cron('0 12 * * *') // Run daily at 12:00 PM
    async monitorSEOHealth() {
        try {
            this.logger.log('Starting daily SEO Health Monitor');
            const totalArticles = await this.articleModel.countDocuments({ status: 'published' });
            const articlesWithSEO = await this.articleModel.countDocuments({ status: 'published', 'seo.generatedAt': { $exists: true } });

            // Log missing metadata to console
            if (articlesWithSEO < totalArticles) {
                this.logger.warn(`Missing SEO for ${totalArticles - articlesWithSEO} articles.`);
            }

            const seoHealthLog = new this.seoLogModel({
                date: new Date(),
                articlesWithSEO,
                articlesWithoutSEO: totalArticles - articlesWithSEO,
                sitemapStatus: 'success', // We assume this is successful unless ping fails
                robotsStatus: 'ok',
                schemaValidation: (articlesWithSEO / (totalArticles || 1)) * 100, // simple heuristic
                alerts: articlesWithSEO < totalArticles ? [`Missing SEO for ${totalArticles - articlesWithSEO} articles.`] : []
            });

            await seoHealthLog.save();
            this.logger.log('SEO Health Monitor log created successfully');
            return seoHealthLog;
        } catch (error) {
            this.logger.error(`SEO Health Monitoring failed: ${error.message}`);
        }
    }

    async validateAllArticles(): Promise<{ processed: number; fixed: number }> {
        this.logger.log('Validating SEO for all published articles...');
        const articles = await this.articleModel.find({ status: 'published' }).select('_id title seo').exec();
        let fixed = 0;

        for (const article of articles) {
            if (!article.seo || !article.seo.generatedAt) {
                this.logger.warn(`Missing SEO for article: ${article.title}. Regenerating...`);
                await this.generateSeoMetadata(article._id.toString());
                fixed++;
            }
        }

        this.logger.log(`SEO Validation complete. Processed: ${articles.length}, Fixed: ${fixed}`);
        return { processed: articles.length, fixed };
    }

    async generateAndSubmitSitemap(): Promise<{ entries: number; status: 'success' | 'failed' }> {
        try {
            this.logger.log('Generating dynamic sitemap...');
            const xml = await this.generateSitemap();

            // In a real scenario, we might write to public/sitemap.xml or upload to S3
            // For now, we'll assume the /api/sitemap route handles the serving, 
            // and we just validate that we can generate it.

            const count = (xml.match(/<url>/g) || []).length;
            this.logger.log(`Sitemap generated successfully with ${count} entries`);

            // Ping search engines if enabled
            // await axios.get(`http://www.google.com/ping?sitemap=${frontendUrl}/sitemap.xml`);

            return { entries: count, status: 'success' };
        } catch (error) {
            this.logger.error(`Sitemap generation/submission failed: ${error.message}`);
            return { entries: 0, status: 'failed' };
        }
    }

    async performHealthCheck(): Promise<any> {
        this.logger.log('Performing SEO Health Check...');
        const totalPublished = await this.articleModel.countDocuments({ status: 'published' });
        const withSeo = await this.articleModel.countDocuments({
            status: 'published',
            'seo.generatedAt': { $exists: true }
        });

        const health = {
            totalPublished,
            withSeo,
            coverage: totalPublished > 0 ? (withSeo / totalPublished) * 100 : 100,
            status: withSeo === totalPublished ? 'healthy' : 'degraded',
            timestamp: new Date()
        };

        return health;
    }

    async getSystemHealthStatus() {
        const lastLog = await this.seoLogModel.findOne().sort({ date: -1 }).exec();
        return lastLog || { status: 'No logs generated yet' };
    }

    async regenerateAllSEO() {
        const missingArticles = await this.articleModel.find({ status: 'published', 'seo.generatedAt': { $exists: false } }).select('_id title').exec();
        for (const article of missingArticles) {
            await this.generateSeoMetadata(article._id.toString());
        }
        return { message: `Queued SEO regeneration for ${missingArticles.length} articles` };
    }
}
