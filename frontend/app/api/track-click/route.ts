import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, headlineVariant } = body;

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';

        if (backendUrl) {
            await axios.post(`${backendUrl}/api/analytics/click`, {
                articleId,
                variant: headlineVariant
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Click tracking proxy failed', error.message);
        return NextResponse.json({ success: false, error: 'Tracking failed' });
    }
}
