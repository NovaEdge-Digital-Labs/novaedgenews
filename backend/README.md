# NovaEdge News Backend

Production-grade automated news engine built with NestJS.

## Prerequisites
- Node.js (v20+)
- MongoDB
- Redis (for BullMQ)

## Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with your API keys (OpenRouter/Gemini & NewsAPI).
4. `npm run build`
5. `npm run start:prod`

## Key Features
- **Automated Discovery**: Cron-triggered news fetching.
- **AI Transformation**: Multi-model fallback (OpenRouter/Gemini) for unique, SEO-optimized reporting.
- **Hacker News Ranking**: Intelligence trending score based on view velocity and recency.
- **Safety Kill-Switch**: Automatic halt on consecutive failures to prevent cost spikes or loops.
