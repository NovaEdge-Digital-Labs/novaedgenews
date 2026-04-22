'use client';

import { useEffect } from 'react';

interface AdComponentProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    style?: React.CSSProperties;
    className?: string;
}

const AdComponent = ({ slot, format = 'auto', style, className }: AdComponentProps) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`ad-container my-8 overflow-hidden flex justify-center ${className}`}>
            <ins
                className="adsbygoogle"
                style={style || { display: 'block' }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
                suppressHydrationWarning
            />
        </div>
    );
};

export default AdComponent;
