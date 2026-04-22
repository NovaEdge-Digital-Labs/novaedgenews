import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DistributionService } from './src/modules/distribution/distribution.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const distributionService = app.get(DistributionService);

    console.log('--- Testing Distribution Flow ---');

    const mockArticle = {
        _id: 'mock_article_id_123',
        title: 'NVIDIA Launches Blackwell B200 GPU',
        headline: 'Breaking: NVIDIA Unveils Most Powerful AI Chip Ever',
        summary: 'NVIDIA has officially announced the Blackwell B200 GPU, promising significant leaps in AI performance and efficiency.',
        slug: 'nvidia-blackwell-b200-gpu',
        category: 'Technology',
        tags: ['NVIDIA', 'AI', 'GPU'],
        views: 1250,
        deepAnalysis: false,
        content: 'Full article content would go here...'
    };

    console.log('Distributing article...');
    const results = await distributionService.distribute(mockArticle);

    console.log('Distribution Results Summary:');
    results.forEach((res, i) => {
        console.log(`Platform ${i + 1}:`, res.status === 'fulfilled' ? 'Success' : 'Failed', res.status === 'rejected' ? res.reason : '');
    });

    await app.close();
    process.exit(0);
}

bootstrap().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
