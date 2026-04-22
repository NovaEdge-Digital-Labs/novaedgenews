'use client';

import { useEffect, useRef } from 'react';
import { trackView, trackClick } from './api';
import { useUserStore } from './store';
import { v4 as uuidv4 } from 'uuid';

export const useTracking = (articleId?: string) => {
    const { sessionId, setSessionId } = useUserStore();
    const tracked = useRef(false);

    useEffect(() => {
        // Initialize session ID if not exists
        if (!sessionId) {
            setSessionId(uuidv4());
        }

        // Track view for article if provided
        if (articleId && !tracked.current && sessionId) {
            trackView(articleId, sessionId, document.referrer);
            tracked.current = true;
        }
    }, [articleId, sessionId, setSessionId]);

    const trackArticleClick = (articleId: string, targetUrl: string, variant?: 'A' | 'B') => {
        trackClick(articleId, variant || targetUrl);
    };

    return { trackArticleClick };
};
