'use client';

import { useEffect } from 'react';

interface AdBannerProps {
    slot: string;
    className?: string;
}

export default function AdBanner({ slot, className }: AdBannerProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Google Ads error:', err);
        }
    }, []);

    return (
        <div className={`flex justify-center items-center overflow-hidden my-8 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
