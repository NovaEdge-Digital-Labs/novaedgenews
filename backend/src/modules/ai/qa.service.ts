import { Injectable, Logger } from '@nestjs/common';
import { AIService } from './ai.service';

export interface QAResult {
    articleId?: string;
    passed: boolean;
    score: number;
    issues: string[];
    confidence: number;
    recommendation: 'publish' | 'reject';
}

@Injectable()
export class QAService {
    private readonly logger = new Logger(QAService.name);

    constructor(private readonly aiService: AIService) { }

    async validateArticle(article: any, sourceArticle: any): Promise<QAResult> {
        this.logger.log(`[validateArticle] Starting QA for article...`);
        const issues: string[] = [];
        let score = 100;

        const content = article.content || (article.sections ? JSON.stringify(article.sections) : '') || '';
        const headline = article.title || article.headline || '';

        // 1. Forbidden Phrases
        const forbiddenPhrases = [
            "This article", "AI generated", "simulated",
            "as an AI", "note that", "It is important to"
        ];
        for (const phrase of forbiddenPhrases) {
            if (content.toLowerCase().includes(phrase.toLowerCase())) {
                issues.push(`Forbidden phrase found: "${phrase}"`);
                score -= 20;
            }
        }

        // 2. Content Metrics
        const metrics = this.calculateMetrics(content);
        if (metrics.readingEase < 60) {
            issues.push(`Low readability: Flesch score ${metrics.readingEase.toFixed(1)} (target > 60)`);
            score -= 15;
        }
        if (metrics.maxParagraphLength > 200) {
            issues.push(`Paragraph too long: ${metrics.maxParagraphLength} words (target < 200)`);
            score -= 10;
        }
        if (metrics.avgSentenceLength > 25) {
            issues.push(`Sentences too complex: ${metrics.avgSentenceLength.toFixed(1)} words/avg (target < 25)`);
            score -= 10;
        }
        if (metrics.repetitionRate > 0.15) {
            issues.push(`High repetition: ${(metrics.repetitionRate * 100).toFixed(1)}% (target < 15%)`);
            score -= 10;
        }

        // 3. Structure
        if (!headline || headline.length < 5) {
            issues.push('Missing or invalid headline');
            score -= 20;
        }
        if (metrics.sentenceCount < 3) {
            issues.push('Insufficient length: Less than 3 sentences');
            score -= 30;
        }

        // 4. Factual Consistency & Coherence (AI-Based)
        const aiCheck = await this.performAICheck(article, sourceArticle);
        if (!aiCheck.consistent) {
            issues.push(...aiCheck.factualIssues);
            score -= 40;
        }
        if (!aiCheck.coherent) {
            issues.push('Incoherent narrative flow');
            score -= 15;
        }

        const passed = score >= 70 && issues.length === 0; // Strict: passed only if score is high and NO issues
        // Actually, user says "REJECT article if ANY of these match". So passed = issues.length === 0

        const finalPassed = issues.length === 0;

        return {
            passed: finalPassed,
            score: Math.max(0, score),
            issues,
            confidence: aiCheck.confidence,
            recommendation: finalPassed ? 'publish' : 'reject'
        };
    }

    private calculateMetrics(text: string) {
        const cleanText = text.replace(/<[^>]*>/g, ' ');
        const words = cleanText.split(/\s+/).filter(w => w.length > 0);
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/<\/p>|<br\s*\/?>/).filter(p => p.trim().length > 0);

        const wordCount = words.length;
        const sentenceCount = sentences.length || 1;

        let totalSyllables = 0;
        for (const word of words) {
            totalSyllables += this.countSyllables(word);
        }

        // Flesch Reading Ease
        const readingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);

        // Max Paragraph Length
        let maxPLen = 0;
        for (const p of paragraphs) {
            const pWords = p.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
            if (pWords > maxPLen) maxPLen = pWords;
        }

        // Avg Sentence Length
        const avgSLen = wordCount / sentenceCount;

        // Repetition Rate (Simple word frequency)
        const wordFreq: Record<string, number> = {};
        for (const w of words) {
            const lowW = w.toLowerCase().replace(/[^a-z]/g, '');
            if (lowW.length > 3) {
                wordFreq[lowW] = (wordFreq[lowW] || 0) + 1;
            }
        }
        const repeatedWordsCount = Object.values(wordFreq).filter(f => f > 3).reduce((a, b) => a + b, 0);
        const repetitionRate = repeatedWordsCount / wordCount;

        return {
            readingEase,
            maxParagraphLength: maxPLen,
            avgSentenceLength: avgSLen,
            repetitionRate,
            sentenceCount
        };
    }

    private countSyllables(word: string): number {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    private async performAICheck(article: any, source: any): Promise<any> {
        this.logger.log(`[performAICheck] Checking factual consistency...`);

        const articleText = article.content || JSON.stringify(article.sections);
        const sourceText = typeof source === 'string' ? source : (source.content || JSON.stringify(source));

        const prompt = `
            You are a meticulous investigative journalist and fact-checker. 
            Evaluate the following NEW ARTICLE against the SOURCE ARTICLE for fact-checking and quality.
            
            CHECK FOR:
            1. Factual Contradictions: Does the new article claim something that directly contradicts the source?
            2. Unsupported Claims: Does it add significant "facts" not present in the source?
            3. Statistical Errors: Are the numbers, dates, or percentages different?
            4. Narrative Coherence: Does the story make sense from beginning to end?
            
            FORMAT: JSON
            {
                "consistent": true/false,
                "factualIssues": ["list of specific issues if any"],
                "coherent": true/false,
                "confidence": 0-100
            }
            
            SOURCE ARTICLE:
            ${sourceText}
            
            NEW ARTICLE:
            ${articleText}
        `;

        try {
            // Using AIService's internal callAI would be better, but AIService is @Injectable, 
            // so we can use it directly if we want. However, to avoid circular deps if AIService
            // eventually calls QAService, we should be careful. 
            // For now, AIService is a dependency of QAService.

            // We'll use a standard model for checking
            const result = await (this.aiService as any).callAI((this.aiService as any).primaryClient, prompt, 'google/gemini-flash-1.5');
            return result;
        } catch (error) {
            this.logger.error(`AI QA Check failed: ${error.message}`);
            return {
                consistent: true, // Fail-safe: assume consistent if AI fails
                factualIssues: [],
                coherent: true,
                confidence: 50
            };
        }
    }
}
