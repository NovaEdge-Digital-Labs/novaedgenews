'use client';

import { useEffect, useState } from 'react';

export default function ArticleTracker({ article }: { article: any }) {
    const [headlineVariant, setHeadlineVariant] = useState('A');

    useEffect(() => {
        // Generate variant A or B randomly if not dictated natively
        const variant = Math.random() > 0.5 ? 'A' : 'B';
        setHeadlineVariant(variant);

        // Track page view
        fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                articleId: article._id || article.id || article.slug,
                slug: article.slug,
                headline: article.headline || article.title,
                headlineVariant: variant,
                referrer: document.referrer
            })
        }).catch(e => console.error("View tracking failed", e));

        // Track external link clicks
        const handleLinkClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a');
            if (target && target.href.startsWith('http') && !target.href.includes(window.location.hostname)) {
                fetch('/api/track-click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        articleId: article._id || article.id || article.slug,
                        slug: article.slug,
                        headline: article.headline || article.title,
                        headlineVariant: variant,
                        targetUrl: target.href
                    })
                }).catch(e => console.error("Click tracking failed", e));
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, [article]);

    return null;
}
