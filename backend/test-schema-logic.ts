import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './src/schemas/article.schema';
import { Model } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const articleModel = app.get<Model<ArticleDocument>>(getModelToken(Article.name));

    console.log('--- Testing Auto-Publishing Rules ---');

    const testArticle = new articleModel({
        title: 'Test Article for Auto Rules',
        content: 'This is a test content with enough words to pass basic internal checks.',
        summary: 'A short summary for testing auto-SEO.',
        tags: ['tech', 'ai', 'innovation'],
        source: 'Manual Test'
    });

    const saved = await testArticle.save();

    console.log('Article Saved Successfully:');
    console.log('Slug:', saved.slug);
    console.log('Category:', saved.category);
    console.log('Status:', saved.status);
    console.log('IsLive:', saved.isLive);
    console.log('LiveDate:', saved.liveDate);
    console.log('MetaTitle:', saved.metaTitle);
    console.log('MetaDescription:', saved.metaDescription);
    console.log('MetaKeywords:', saved.metaKeywords);

    // Cleanup
    await articleModel.deleteOne({ _id: saved._id });
    console.log('\nTest Article Cleaned Up.');

    await app.close();
    process.exit(0);
}

bootstrap().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
