export default () => ({
    port: parseInt(process.env.PORT || '3005', 10),
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/novaedge',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    ai: {
        openrouter: process.env.OPENROUTER_API_KEY,
        gemini: process.env.GEMINI_API_KEY,
    },
    news: {
        apiKey: process.env.NEWS_API_KEY,
    },
    social: {
        twitter: {
            apiKey: process.env.TWITTER_API_KEY,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
        },
        facebook: {
            pageId: process.env.FACEBOOK_PAGE_ID,
            accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        },
        telegram: {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID,
        },
    },
});
