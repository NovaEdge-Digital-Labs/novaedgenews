import { NextResponse } from 'next/server';
import api from '@/lib/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Forward tracking to backend
        await api.post('/api/track-impression', body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track Impression Route Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
