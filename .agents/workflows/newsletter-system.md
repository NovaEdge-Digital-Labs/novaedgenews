---
description: Workflow for dispatching the daily Newsletter system
---

# Newsletter System Workflow

This workflow handles the selection of trending articles, HTML generation, and dispatch via SendGrid.

### Phase 1: Preparation
1. **Trigger**: Manual trigger via `/newsletter-send` or automated at 7:00 AM IST.
2. **Audience Filter**: 
   - Get subscribers where `status == "active"` and `isSubscribed == true`.
3. **Content Selection**:
   - Query articles published in the last 24 hours.
   - Sort by `trendingScore` (descending).
   - Pick top 5 articles.

### Phase 2: Generation
1. **Template Injection**:
   - Inject article titles, excerpts, images, and links into the `daily-digest` HTML template.
   - Generate unique unsubscribe links using `UNSUBSCRIBE_BASE_URL`.
2. **Preview**:
   - (Optional) Send a test email to `NEWSLETTER_ADMIN_EMAIL`.

### Phase 3: Dispatch & Logging
1. **SendGrid API**:
   - Batch send using personalization to include subscriber names.
2. **Logging**:
   - Create a record in `NewsletterModel` with `sentCount` and `articleIds`.
   - Update `NewsletterSeoLog` with phase `newsletter_send`.

### Phase 4: Output
- Returns `sendCount`, `totalFailures`, and `executionTime`.
