---
description: Workflow for AI-driven SEO metadata generation
---

# SEO System Workflow

This workflow automates the generation of meta tags and JSON-LD schema for newly published articles.

### Phase 1: Trigger
- **Event**: Article published event in the system.
- **Input**: `articleId`.

### Phase 2: AI Generation
1. **Extraction**: Retrieve article title, category, and full content.
2. **Meta Tags**: Use AI (Gemini/OpenRouter) to generate:
   - Primary Focus Keyword
   - SEO Title (max 60 chars)
   - Meta Description (max 155 chars)
   - Social Media Titles/Descriptions (OG/Twitter)
3. **Structured Data**: Generate JSON-LD Schema (Article/NewsArticle) including author, publisher, and date information.

### Phase 3: Database Sync
1. **Update**: Store the generated metadata in the `seo` field of the Article document.
2. **Timestamp**: Set `seo.generatedAt`.

### Phase 4: Validation
1. **Integrity Check**: Ensure all required meta tags are present.
2. **Schema Audit**: Verify JSON-LD format.

### Phase 5: Output
- Returns `articleId` and `status: "seo_generated"`.
