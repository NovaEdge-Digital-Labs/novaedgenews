import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
        const response = await axios.get(`${backendUrl}/api/seo/sitemap.xml`);

        return new NextResponse(response.data, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('Failed to fetch sitemap:', error);
        return new NextResponse('Failed to load sitemap', { status: 500 });
    }
}
