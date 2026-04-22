---
description: Workflow for sitemap generation and submission
---

# Sitemap Generator Workflow

This workflow ensures the dynamic sitemap is updated and submitted to search engines.

### Phase 1: Trigger
- **Trigger**: Automated daily at 11:30 AM IST.

### Phase 2: Retrieval
1. **Query**: Find all articles with `status == "published"`.
2. **Selection**: Select `slug`, `updatedAt`, and `category`.

### Phase 3: Construction
1. **XML Building**:
   - Generate `<urlset>` following Sitemaps.org protocol.
   - Include `<loc>`, `<lastmod>`, and `<changefreq>`.
   - Add image sitemap tags if applicable.
2. **Caching**: Store the generated XML string in Redis or a static file.

### Phase 4: Submission
1. **Google Search Console**: 
   - Ping Google: `http://www.google.com/ping?sitemap=SITEMAP_URL`
2. **Bing Webmaster Tools**:
   - Ping Bing: `http://www.bing.com/ping?sitemap=SITEMAP_URL`

### Phase 5: Logging
1. **Audit**: Log the number of entries and submission status to `SeoLog`.
2. **Phase Log**: Update `NewsletterSeoLog` with phase `sitemap_sync`.

### Phase 6: Output
- Returns `entryCount`, `submissionStatus`, and `timestamp`.
