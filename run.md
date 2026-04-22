# Running and Deploying NovaEdge News

This guide provides instructions on how to run the NovaEdge News project locally and how to deploy it to production (Vercel).

## Project Overview

NovaEdge News is a modern news platform consisting of:
- **Frontend**: A [Next.js](https://nextjs.org) application located in the `/frontend` directory.
- **Backend**: A [NestJS](https://nestjs.com) application located in the `/backend` directory.

---

## Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18 or later recommended)
- **NPM**, Yarn, or PNPM
- **MongoDB** (Running on `localhost:27017` by default)
- **Redis** (Running on `localhost:6379` for caching and queues)

### 2. Backend Setup
The backend handles data processing, scheduling, and API services.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend/` directory (you can copy `.env.example` if available).
   ```env
   PORT=3005
   MONGODB_URI=mongodb://localhost:27017/novaedge
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # AI & External APIs
   OPENROUTER_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   NEWS_API_KEY=your_key_here

   # Distribution & Notifications
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=newsletter@yourdomain.com
   NEWSLETTER_ADMIN_EMAIL=admin@yourdomain.com

   # SEO & Search Console
   GOOGLE_SEARCH_CONSOLE_API_KEY=your_gsc_key
   SITEMAP_URL=https://yourdomain.com/sitemap.xml
   BASE_DOMAIN=yourdomain.com
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3005/api`.

### 3. Frontend Setup
The frontend is the user interface built with Next.js.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (Optional):
   The frontend defaults to using `http://localhost:3005/api`. To override it, create a `.env.local` in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3005/api
   NEXT_PUBLIC_ADSENSE_ID=your_adsense_id
   ```
3. Start the frontend in development mode:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment Guide

### Deploying Frontend to Vercel

1. **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and import your repository.
   - Set the **Framework Preset** to `Next.js`.
   - The **Root Directory** should be `frontend`.
3. **Configure Environment Variables**:
   In the Vercel dashboard, add the following variables:
   - `NEXT_PUBLIC_API_URL`: Your PRODUCTION backend URL (e.g., `https://api.yourdomain.com/api`).
   - `NEXT_PUBLIC_ADSENSE_ID`: Your Google AdSense ID.
   - Any `AD_SLOT_*` variables used in the code.
4. **Deploy**: Click "Deploy". Vercel will build and serve your frontend.

### Deploying Backend (NestJS)

Since NestJS is a persistent server, it is recommended to host it on a platform that supports Node.js services:

- **Render / Railway / Fly.io**: These are great options for deploying the `/backend` folder as a standalone Node.js service.
- **Vercel (Advanced)**: While possible, deploying a full NestJS app on Vercel requires specific configuration (like `vercel.json`) to map routes to internal functions. For performance and complexity reasons, a persistent server is usually preferred.

**Note**: Ensure your MongoDB and Redis instances are accessible from your production backend.

---

## Automation & Scheduling

The backend includes a **Newsletter & SEO Sync Scheduler** that orchestrates daily tasks:

- **6:00 AM IST**: Pre-Newsletter SEO verification.
- **7:00 AM IST**: Daily Newsletter dispatch to active subscribers.
- **11:30 AM IST**: Dynamic Sitemap update and submission to GSC/Bing.
- **12:00 PM IST**: SEO Health Check and system audit.
- **Weekly (Sun 6:00 PM)**: Performance analytics and report generation.

### Monitoring & Alerts
Critical failures and daily summaries are sent via:
- **Telegram**: Real-time alerts for system degradation or task failure.
- **Email**: Admin reports for delivery metrics and weekly analytics.

---

## Agent Workflows

Common operational tasks are documented as structured workflows in `.agents/workflows/`:
- `newsletter-system`: Manual dispatch and subscriber management.
- `seo-system`: AI-driven metadata generation for articles.
- `sitemap-generator`: Sitemap maintenance and submission.

To execute a workflow, you can refer to the documentation or ask the AI agent to follow the steps in the corresponding `.md` file.

---

## Commands Summary

| Action | Location | Command |
| :--- | :--- | :--- |
| **Run Frontend (Dev)** | `/frontend` | `npm run dev` |
| **Build Frontend** | `/frontend` | `npm run build` |
| **Run Backend (Dev)** | `/backend` | `npm run dev` |
| **Build Backend** | `/backend` | `npm build` |
| **Check Logs** | `/backend` | `npm run logs` (if configured) |
