import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, sessionId } = body;

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';

        if (backendUrl) {
            await axios.post(`${backendUrl}/api/analytics/view`, {
                articleId,
                sessionId
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('View tracking proxy failed', error.message);
        // We return success even if tracking fails to not break the frontend
        return NextResponse.json({ success: false, error: 'Tracking failed' });
    }
}
