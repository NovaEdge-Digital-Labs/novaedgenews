import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

function getOrCreateSessionId(request: NextRequest): string {
    // Simple fallback logic since NextRequest doesn't have session object
    const cookie = request.cookies.get('novaedge_session');
    if (cookie?.value) {
        return cookie.value;
    }
    return uuidv4();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, slug, headline, headlineVariant, referrer } = body;

        // Get client info
        const userAgent = request.headers.get('user-agent');
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // Generate/get session ID
        const sessionId = getOrCreateSessionId(request);

        // Connect to DB
        const db = await connectDB();

        // Track headline variant
        const updateQuery: any = {
            $inc: { views: 1 },
            $push: {
                viewHistory: {
                    timestamp: new Date(),
                    sessionId,
                    ip,
                    userAgent,
                    referrer,
                    headline,
                    headlineVariant
                }
            }
        };

        if (headlineVariant) {
            updateQuery.$inc[`headlineMetrics.variant${headlineVariant}.views`] = 1;
        }

        // Update article metrics
        await db.collection('articles').updateOne(
            { slug: slug }, // matching primarily by slug since articleId might be different formatting locally
            updateQuery
        );

        const response = NextResponse.json({ success: true, sessionId });
        // Set cookie if randomly generated
        if (!request.cookies.get('novaedge_session')) {
            response.cookies.set('novaedge_session', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 365, httpOnly: true });
        }
        return response;
    } catch (error: any) {
        console.error('View tracking failed', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
