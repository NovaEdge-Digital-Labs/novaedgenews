export interface Article {
    id: string
    _id?: string // From MongoDB
    title: string
    displayTitle?: string // Chosen variant for A/B testing
    variant?: 'A' | 'B'
    alternativeTitle?: string
    summary: string
    content: string
    category: string
    author: string
    date: string
    publishedAt?: string
    image: string
    readingTime: string
    slug: string
    featured?: boolean
    trendingScore?: number
    source?: string
    headlineA?: { text: string; type: string; keywords?: string[] }
    headlineB?: { text: string; type: string; keywords?: string[] }
    testingActive?: boolean
}

export const categories = [
    { name: "Tech & AI", slug: "tech-ai" },
    { name: "Trending", slug: "trending" },
    { name: "Govt Jobs", slug: "govt-jobs" },
    { name: "Science", slug: "science" },
    { name: "Business", slug: "business" },
]

export const articles: Article[] = [
    {
        id: "1",
        title: "The Future of AI: Beyond Large Language Models",
        summary: "Discover how neuro-symbolic AI and agentic systems are shaping the next decade of technology.",
        content: `
      <p>Artificial Intelligence has seen a meteoric rise with the advent of Large Language Models (LLMs). However, the next frontier lies in systems that can reason, plan, and execute complex tasks with higher reliability than current models offer.</p>
      <p>Neuro-symbolic AI, which combines the pattern recognition capabilities of neural networks with the logical reasoning of symbolic AI, is gaining traction as a potential solution to the hallucinations and reasoning gaps found in current architectures.</p>
      <blockquote>"The future of AI is not just about scale, but about structural understanding and autonomous reasoning."</blockquote>
      <p>As we move towards agentic AI, these systems will transition from being passive tools to active collaborators, capable of managing workflows and making decisions within defined guardrails.</p>
    `,
        category: "Tech & AI",
        author: "Alex Rivera",
        date: "2024-04-20",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
        readingTime: "5 min read",
        slug: "future-of-ai-beyond-llms",
        featured: true,
    },
    {
        id: "2",
        title: "New Govt Job Openings: 2024 Notification",
        summary: "Latest alerts for civil services and technical positions in various departments.",
        content: `
      <p>The recruitment season for 2024 has officially started with several high-profile notifications released this week. Candidates are advised to check the official portals for eligibility criteria and application deadlines.</p>
      <p>Key highlights include over 5,000 vacancies in the technical cadre and a renewed focus on digital skills for administrative roles.</p>
    `,
        category: "Govt Jobs",
        author: "Sarah Chen",
        date: "2024-04-19",
        image: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?auto=format&fit=crop&q=80&w=1200",
        readingTime: "3 min read",
        slug: "govt-job-openings-2024",
        featured: true,
    },
    {
        id: "3",
        title: "Sustainable Tech: Innovations in Green Energy",
        summary: "From next-gen solar panels to solid-state batteries, here are the technologies saving the planet.",
        content: "Content about sustainable tech...",
        category: "Tech & AI",
        author: "Marcus Thorne",
        date: "2024-04-18",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
        readingTime: "4 min read",
        slug: "sustainable-tech-innovations-green-energy",
        featured: true,
    },
    {
        id: "4",
        title: "Market Trends: The Rise of Decentralized Finance",
        summary: "Why traditional banks are looking closely at DeFi protocols in 2024.",
        content: "Content about DeFi...",
        category: "Trending",
        author: "Elena Rodriguez",
        date: "2024-04-17",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
        readingTime: "6 min read",
        slug: "market-trends-rise-of-defi",
    },
    {
        id: "5",
        title: "Quantum Computing: Breaking the Barrier",
        summary: "Researchers achieve new milestone in qubit stability.",
        content: "Content about quantum computing...",
        category: "Tech & AI",
        author: "Dr. Julian Wu",
        date: "2024-04-16",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        readingTime: "7 min read",
        slug: "quantum-computing-breaking-barrier",
    },
]
