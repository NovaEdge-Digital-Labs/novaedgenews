export function levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[len1][len2];
}

export function similarityScore(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
}

export function calculateReadingTime(text: string): number {
    const wordsPerMinute = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

export function isGibberish(text: string): boolean {
    if (!text || text.length < 100) return false;
    // Simple check: if more than 30% of characters are non-alphanumeric/spaces
    const nonAlphanumeric = text.replace(/[a-zA-Z0-9\s]/g, '');
    return nonAlphanumeric.length / text.length > 0.3;
}
