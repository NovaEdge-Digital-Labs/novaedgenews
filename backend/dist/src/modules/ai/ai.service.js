"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AIService = AIService_1 = class AIService {
    configService;
    logger = new common_1.Logger(AIService_1.name);
    primaryClient;
    fallbackClient;
    constructor(configService) {
        this.configService = configService;
        const openrouterKey = this.configService.get('ai.openrouter');
        const geminiKey = this.configService.get('ai.gemini');
        this.logger.log(`AI Config: OpenRouter: ${!!openrouterKey}, Gemini: ${!!geminiKey}`);
        if (openrouterKey) {
            this.primaryClient = new openai_1.default({
                apiKey: openrouterKey,
                baseURL: 'https://openrouter.ai/api/v1',
            });
        }
        if (geminiKey) {
            this.fallbackClient = new openai_1.default({
                apiKey: geminiKey,
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
            });
        }
    }
    async rewriteArticle(rawTitle, rawContent) {
        this.logger.log(`[rewriteArticle] Preparing prompt for standard news: ${rawTitle}`);
        const cleanRawContent = rawContent ? rawContent.replace(/\s\[\+\d+\schars\]$/, '') : '';
        const prompt = `
            You are a skilled digital journalist for NovaEdge.
            Rewrite the following report into a sharp, engaging, and professional news article.
            
            STRUCTURE (Strictly 3 Paragraphs):
            1. Paragraph 1: WHAT happened and WHO is involved. Clear and direct.
            2. Paragraph 2: KEY DETAILS (Where, when, and additional context).
            3. Paragraph 3: WHY IT MATTERS (The impact or broader implications).
            
            STYLE & TONE:
            - Professional but natural. Avoid robotic, academic, or "AI-sounding" transitions.
            - LENGTH: 120-180 words.
            - SENTENCES: Short, punchy, and in the active voice.
            - NO REPETITION: Do not repeat facts across paragraphs.
            
            NEGATIVE CONSTRAINTS (Do NOT use these phrases):
            - "this highlights", "this underscores", "this marks a significant", "this demonstrates".
            - "this article", "this report", "this news".
            
            HEADLINE:
            - Clear, professional, but slightly curiosity-driven.
            - NOT clickbait; should make a tech-savvy user genuinely want to click.
            
            FORMAT: JSON
            {
                "headlineA": {
                    "text": "Informative headline (Facts-based, professional, clear benefit)",
                    "type": "informative",
                    "keywords": ["key1", "key2"]
                },
                "headlineB": {
                    "text": "Curiosity headline (Emotion-driven, intriguing, question or surprise)",
                    "type": "curiosity",
                    "keywords": ["key1", "key2"]
                },
                "content": "The full article body in HTML (using <p> for exactly 3 paragraphs)",
                "summary": "Exactly 2 concise sentences for the lead/meta.",
                "category": "Tech & AI, Cybersecurity, Space, Startups, or Policy",
                "keywords": ["tag1", "tag2"],
                "score": 9
            }
            
            SOURCE REPORT:
            Title: ${rawTitle}
            Content: ${cleanRawContent}
        `;
        try {
            this.logger.log(`[rewriteArticle] Invoking AI for standard news...`);
            const result = await this.callAI(this.primaryClient, prompt, 'google/gemini-flash-1.5');
            return this.validateAndFilter(result, false);
        }
        catch (error) {
            this.logger.warn(`Primary AI failed: ${error.message}`);
            try {
                this.logger.log(`[rewriteArticle] Invoking Fallback AI...`);
                const result = await this.callAI(this.fallbackClient, prompt, 'gemini-1.5-flash');
                return this.validateAndFilter(result, false);
            }
            catch (fallbackError) {
                this.logger.error(`All AI models failed. Error: ${fallbackError.message}`);
                return {
                    title: rawTitle,
                    content: `<p>${cleanRawContent || 'Breaking news update.'}</p><p>Technical reports confirm the event occurred earlier today. Details are emerging as the situation develops.</p><p>This shift indicates broader changes within the sector as innovation continues to accelerate.</p>`,
                    summary: 'Latest technology update from NovaEdge. Details are emerging regarding this development.',
                    category: "Tech & AI",
                    keywords: ["breaking", "tech"],
                    score: 7,
                    modelUsed: 'mock-engine'
                };
            }
        }
    }
    async rewriteAsQuickNews(rawTitle, rawContent) {
        this.logger.log(`[rewriteAsQuickNews] Preparing prompt for Quick News: ${rawTitle}`);
        const cleanRawContent = rawContent ? rawContent.replace(/\s\[\+\d+\schars\]$/, '') : '';
        const prompt = `
            You are a senior news editor for NovaEdge. Your task is to rewrite a report into a "QUICK NEWS" article.
            
            RULES:
            1. CONTENT: Exactly 120-180 words. Information-dense, no repetition.
            2. TONE: Human-like, professional, and factual. NOT AI-like.
            3. OPENING: Start with a strong, punchy sentence that hooks the reader immediately.
            4. SOURCE: Link the original source naturally within the text.
            
            STRICT CONSTRAINTS (FORBIDDEN PHRASES):
            - NO filler phrases: "this highlights", "this underscores", "this marks a", "significant development".
            - NO meta-text: "this article discusses", "AI generated", "simulated", "in this report".
            - NO robotic transitions.
            
            FORMAT: JSON
            {
                "headlineA": {
                    "text": "Informative headline (Facts-based, professional, clear benefit)",
                    "type": "informative",
                    "keywords": ["key1", "key2"]
                },
                "headlineB": {
                    "text": "Curiosity headline (Emotion-driven, intriguing, question or surprise)",
                    "type": "curiosity",
                    "keywords": ["key1", "key2"]
                },
                "content": "Full summary (120-180 words)",
                "summary": "Exactly 30-word one-liner for preview",
                "keyTakeaways": ["Point 1 (max 10 words)", "Point 2", "Point 3"],
                "tone": "professional"
            }
            
            SOURCE REPORT:
            Title: ${rawTitle}
            Content: ${cleanRawContent}
        `;
        try {
            this.logger.log(`[rewriteAsQuickNews] Invoking AI for Quick News...`);
            const result = await this.callAI(this.primaryClient, prompt, 'google/gemini-flash-1.5');
            this.logger.log(`[rewriteAsQuickNews] AI result received. Validating...`);
            return this.validateAndFilter(result, false, true);
        }
        catch (error) {
            this.logger.warn(`Primary AI for Quick News failed: ${error.message}. Attempting fallback...`);
            try {
                const result = await this.callAI(this.fallbackClient, prompt, 'gemini-1.5-flash-latest');
                return this.validateAndFilter(result, false, true);
            }
            catch (fallbackError) {
                this.logger.error(`Quick News generation failed (all models): ${fallbackError.message}`);
                return { status: 'error', message: fallbackError.message };
            }
        }
    }
    async generateDeepAnalysis(quickSummary, originalContent) {
        this.logger.log(`[generateDeepAnalysis] Preparing detailed report...`);
        const prompt = `
            You are a senior deep analysis writer for NovaEdge News. 
            Create a DEEP ANALYSIS report based on the provided Quick News summary and Original Article.
            
            STRUCTURE:
            1. SECTION 1: HEADLINE + INTRO (Target: 100 words)
               - Hook reader, state the core issue, and why it matters.
            2. SECTION 2: BACKGROUND (Target: 150 words)
               - Context, history, and what led to this.
            3. SECTION 3: DETAILS (Target: 300 words)
               - Facts, key players, important quotes/data, and technical details.
            4. SECTION 4: IMPACT & ANALYSIS (Target: 200 words)
               - Who's affected, short-term and long-term implications, industry perspective.
            5. SECTION 5: CONCLUSION (Target: 50 words)
               - Summary, what to watch, and optional call to action.
            
            STRICT RULES:
            - TOTAL LENGTH: Exactly 700-900 words.
            - NO AI meta-text ("this article discusses", "I have generated").
            - HUMAN VOICE throughout. No filler phrases like "this highlights", "this underscores".
            - CITE SOURCES internally and naturally.
            
            FORMAT: JSON
            {
                "headlineA": {
                    "text": "Informative headline (Facts-based, professional, clear benefit)",
                    "type": "informative",
                    "keywords": ["key1", "key2"]
                },
                "headlineB": {
                    "text": "Curiosity headline (Emotion-driven, intriguing, question or surprise)",
                    "type": "curiosity",
                    "keywords": ["key1", "key2"]
                },
                "sections": {
                    "intro": "Paragraph text (approx 100 words)",
                    "background": "Paragraph text (approx 150 words)",
                    "details": "Paragraph text (approx 300 words)",
                    "impact": "Paragraph text (approx 200 words)",
                    "conclusion": "Paragraph text (approx 50 words)"
                },
                "wordCount": 800,
                "readingTimeMinutes": 4
            }
            
            INPUT DATA:
            QUICK SUMMARY: ${quickSummary}
            ORIGINAL ARTICLE: ${originalContent}
        `;
        try {
            this.logger.log(`[generateDeepAnalysis] Invoking AI...`);
            const result = await this.callAI(this.primaryClient, prompt, 'google/gemini-flash-1.5');
            this.logger.log(`[generateDeepAnalysis] AI result received. Validating...`);
            return this.validateAndFilter(result, false, false, true);
        }
        catch (error) {
            this.logger.warn(`Primary AI for Deep Analysis failed: ${error.message}. Attempting fallback...`);
            try {
                const result = await this.callAI(this.fallbackClient, prompt, 'gemini-1.5-flash-latest');
                return this.validateAndFilter(result, false, false, true);
            }
            catch (fallbackError) {
                this.logger.error(`Deep Analysis generation failed (all models): ${fallbackError.message}`);
                return { status: 'error', message: fallbackError.message };
            }
        }
    }
    async generateAnalysis(rawTitle, rawContent) {
        this.logger.log(`[generateAnalysis] Preparing prompt for detailed analysis: ${rawTitle}`);
        const cleanRawContent = rawContent ? rawContent.replace(/\s\[\+\d+\schars\]$/, '') : '';
        const prompt = `
            You are a senior editor and lead analyst at NovaEdge. 
            Generate a premium, in-depth news analysis piece based on the provided report.
            
            STRUCTURE:
            1. Introduction: Hook the reader and state exactly what happened.
            2. Background: Provide historical or industry context.
            3. Key Details: Breakdown the primary facts, figures, and events.
            4. Analysis: Deep dive into the impact, market implications, or technological shifts.
            5. Conclusion: Synthesize what this means for the future of the industry.
            
            STYLE & TONE:
            - Premium editorial style (The Economist or MIT Tech Review level).
            - LENGTH: 700–900 words.
            - Authority: Provide real value and meaningful insights beyond basic news.
            - Clarity: Structured, clean paragraphs. Active voice. High-signal content.
            
            STRICT RULES:
            - NO filler phrases or padding.
            - NO robotic transitions ("this highlights", "this underscores", "this marks a significant").
            - NO AI/meta commentary ("this article", "this analysis").
            
            FORMAT: JSON
            {
                "headlineA": {
                    "text": "Informative headline (Facts-based, professional, clear benefit)",
                    "type": "informative",
                    "keywords": ["key1", "key2"]
                },
                "headlineB": {
                    "text": "Curiosity headline (Emotion-driven, intriguing, question or surprise)",
                    "type": "curiosity",
                    "keywords": ["key1", "key2"]
                },
                "content": "Full depth-first analysis in HTML (at least 5-7 major sections with <h3> tags)",
                "summary": "Exactly 2 dense, high-impact summary sentences.",
                "category": "Editorial / Analysis",
                "keywords": ["analysis", "insight", "tech-trends"],
                "score": 10
            }
            
            SOURCE MATERIAL:
            Title: ${rawTitle}
            Content: ${cleanRawContent}
        `;
        try {
            this.logger.log(`[generateAnalysis] Invoking AI for premium analysis...`);
            const result = await this.callAI(this.primaryClient, prompt, 'google/gemini-flash-1.5');
            return this.validateAndFilter(result, true);
        }
        catch (error) {
            this.logger.error(`Analysis generation failed: ${error.message}`);
            throw error;
        }
    }
    validateAndFilter(result, isAnalysis, isQuickNews = false, isDeepAnalysis = false) {
        const forbiddenPhrases = [
            'simulated', 'generated', 'in a live environment', 'this article', 'this report', 'this news',
            'this highlights', 'this underscores', 'this marks a significant', 'this demonstrates',
            'openai', 'anthropic', 'language model'
        ];
        const textToSearch = JSON.stringify(result).toLowerCase();
        for (const phrase of forbiddenPhrases) {
            if (textToSearch.includes(phrase.toLowerCase())) {
                throw new Error(`AI content rejected: Contains prohibited phrase "${phrase}"`);
            }
        }
        if (isDeepAnalysis) {
            if (!result.sections || typeof result.sections !== 'object') {
                throw new Error('Deep Analysis rejected: Missing sections object');
            }
            const sectionsList = ['intro', 'background', 'details', 'impact', 'conclusion'];
            let totalWords = 0;
            for (const section of sectionsList) {
                const text = result.sections[section] || '';
                const count = text.split(/\s+/).filter((w) => w.length > 0).length;
                totalWords += count;
                if (count === 0)
                    throw new Error(`Deep Analysis rejected: Section "${section}" is empty`);
            }
            if (totalWords < 650 || totalWords > 1100) {
                throw new Error(`Deep Analysis rejected: Total word count out of bounds (${totalWords})`);
            }
            result.wordCount = totalWords;
            result.readingTimeMinutes = Math.ceil(totalWords / 225);
            return result;
        }
        if (isQuickNews) {
            const content = result.content || '';
            const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
            const headlineWordCount = (result.headline || '').split(/\s+/).filter(w => w.length > 0).length;
            if (wordCount < 110 || wordCount > 210) {
                throw new Error(`Quick News rejected: Content word count out of bounds (${wordCount}, target 120-180)`);
            }
            if (!Array.isArray(result.keyTakeaways) || result.keyTakeaways.length !== 3) {
                throw new Error('Quick News rejected: Must have exactly 3 key takeaways');
            }
            return result;
        }
        const wordLimit = isAnalysis ? 600 : 100;
        const bodyContent = result.content || '';
        const wordCount = bodyContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount < wordLimit) {
            throw new Error(`Content rejected: Too short (${wordCount} words)`);
        }
        if (!isAnalysis) {
            const pCount = (bodyContent.match(/<p>/g) || []).length;
            if (pCount !== 3) {
                throw new Error(`News rejected: Does not have exactly 3 paragraphs (${pCount} found)`);
            }
        }
        return result;
    }
    async callAI(client, prompt, model) {
        if (!client) {
            this.logger.warn(`AI client for model ${model} not configured`);
            throw new Error('AI client not configured');
        }
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
        });
        const content = response.choices[0].message.content;
        if (!content)
            throw new Error('Empty AI response');
        const result = JSON.parse(content);
        const hasTitle = result.headlineA || result.headlineB || result.title || result.headline;
        const hasBody = result.content || result.sections;
        const hasSummary = result.summary || (result.sections && result.sections.intro);
        if (!hasTitle || !hasBody || !hasSummary) {
            throw new Error('Missing core fields in AI response');
        }
        if (!result.headlineA && (result.title || result.headline)) {
            result.headlineA = { text: result.title || result.headline, type: 'informative', keywords: result.keywords || [] };
        }
        if (!result.headlineB && result.headlineA) {
            result.headlineB = { ...result.headlineA, type: 'curiosity' };
        }
        return { ...result, modelUsed: model };
    }
};
exports.AIService = AIService;
exports.AIService = AIService = AIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map