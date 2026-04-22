"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const mongoose_1 = require("@nestjs/mongoose");
const article_schema_1 = require("./src/schemas/article.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const articleModel = app.get((0, mongoose_1.getModelToken)(article_schema_1.Article.name));
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
    await articleModel.deleteOne({ _id: saved._id });
    console.log('\nTest Article Cleaned Up.');
    await app.close();
    process.exit(0);
}
bootstrap().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
//# sourceMappingURL=test-schema-logic.js.map