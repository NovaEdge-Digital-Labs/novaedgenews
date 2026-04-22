import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, slug, headline, headlineVariant, targetUrl } = body;

        const db = await connectDB();

        const updateQuery: any = {
            $inc: { clicks: 1 },
            $push: {
                clickHistory: {
                    timestamp: new Date(),
                    targetUrl,
                    headlineVariant
                }
            }
        };

        // Update headline variant clicks
        if (headlineVariant) {
            updateQuery.$inc[`headlineMetrics.variant${headlineVariant}.clicks`] = 1;
        }

        // Update click metrics
        await db.collection('articles').updateOne(
            { slug: slug },
            updateQuery
        );

        // Update CTR
        const article = await db.collection('articles').findOne({ slug: slug });
        if (article && article.views > 0) {
            const ctr = article.clicks / article.views;
            await db.collection('articles').updateOne(
                { slug: slug },
                { $set: { ctr } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Click tracking failed', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
