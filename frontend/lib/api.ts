import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const trackView = async (articleId: string, sessionId?: string, referrer?: string) => {
    try {
        await api.post('/api/analytics/view', {
            articleId,
            timestamp: new Date().toISOString(),
            sessionId: sessionId || 'anonymous',
            referrer: referrer || 'direct',
        });
    } catch (error) {
        console.error('Error tracking view:', error);
    }
};

export const trackImpression = async (articleId: string, variant: string) => {
    try {
        await api.post('/api/analytics/impression', {
            articleId,
            variant,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error tracking impression:', error);
    }
};

export const trackClick = async (articleId: string, targetUrlOrVariant: string) => {
    try {
        const isUrl = targetUrlOrVariant.startsWith('/');
        await api.post('/api/analytics/click', {
            articleId,
            timestamp: new Date().toISOString(),
            variant: isUrl ? undefined : targetUrlOrVariant,
            targetUrl: isUrl ? targetUrlOrVariant : undefined,
        });
    } catch (error) {
        console.error('Error tracking click:', error);
    }
};

export const getLatestArticles = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/api/articles/latest?page=${page}&limit=${limit}`);
        return { data: response.data?.articles || [] };
    } catch (error) {
        console.error('Error fetching latest articles:', error);
        return { data: [] };
    }
};

export const getTrendingArticles = async (limit = 10) => {
    try {
        const response = await api.get(`/api/articles/trending?limit=${limit}`);
        return response.data?.articles || [];
    } catch (error) {
        console.error('Error fetching trending articles:', error);
        return [];
    }
};

export const getEditorPicks = async (limit = 6) => {
    try {
        const response = await api.get(`/api/articles/editor-picks?limit=${limit}`);
        return response.data?.articles || [];
    } catch (error) {
        console.error('Error fetching editor picks:', error);
        return [];
    }
};

export const getMostRead = async (limit = 5) => {
    try {
        const response = await api.get(`/api/articles/most-read?limit=${limit}`);
        return response.data?.articles || [];
    } catch (error) {
        console.error('Error fetching most read articles:', error);
        return [];
    }
};

export const getArticleBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/api/articles/${slug}`);
        return response.data?.article || null;
    } catch (error) {
        console.error(`Error fetching article with slug ${slug}:`, error);
        return null;
    }
};

export const getArticlesByCategory = async (category: string, page = 1, limit = 12) => {
    try {
        const response = await api.get(`/api/articles/category/${category}?page=${page}&limit=${limit}`);
        return {
            articles: response.data?.articles || [],
            totalPages: response.data?.totalPages || 0,
        };
    } catch (error) {
        console.error(`Error fetching articles for category ${category}:`, error);
        return { articles: [], totalPages: 0 };
    }
};

export const subscribeToNewsletter = async (email: string, preferences?: any, source: string = 'homepage') => {
    try {
        const response = await api.post('/newsletter/subscribe', { email, preferences, source });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to subscribe');
    }
};

export const unsubscribeFromNewsletter = async (token: string) => {
    try {
        const response = await api.post('/newsletter/unsubscribe', { token });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to unsubscribe');
    }
};

export default api;
