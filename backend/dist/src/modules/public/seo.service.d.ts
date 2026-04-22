import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
export declare class SEOService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    generateSitemap(baseUrl: string): Promise<string>;
    generateRSS(baseUrl: string): Promise<string>;
    getJsonLd(article: Article, baseUrl: string): {
        '@context': string;
        '@type': string;
        headline: string;
        description: string;
        image: string[];
        datePublished: string;
        author: {
            '@type': string;
            name: string;
            url: string;
        }[];
        publisher: {
            '@type': string;
            name: string;
            logo: {
                '@type': string;
                url: string;
            };
        };
    };
}
