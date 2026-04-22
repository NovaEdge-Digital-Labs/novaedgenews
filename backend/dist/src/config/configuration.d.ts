declare const _default: () => {
    port: number;
    database: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
    };
    ai: {
        openrouter: string | undefined;
        gemini: string | undefined;
    };
    news: {
        apiKey: string | undefined;
    };
    social: {
        twitter: {
            apiKey: string | undefined;
            accessToken: string | undefined;
        };
        facebook: {
            pageId: string | undefined;
            accessToken: string | undefined;
        };
        telegram: {
            botToken: string | undefined;
            chatId: string | undefined;
        };
    };
};
export default _default;
