import NewsletterForm from "@/components/NewsletterForm";

export const metadata = {
    title: "Subscribe to NovaEdge News",
    description: "Get the latest in Tech, AI, and startup news delivered to your inbox every morning.",
};

export default function SubscribePage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Stay Informed, Stay Ahead</h1>
                    <p className="text-xl text-muted-foreground">
                        Join 10,000+ professionals getting our daily digest of the most important news in Tech and AI.
                    </p>
                </div>

                <NewsletterForm />

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                        </div>
                        <h3 className="font-semibold mb-2">Curated for You</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                            Only the most relevant stories, hand-picked by our AI and editorial team.
                        </p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <h3 className="font-semibold mb-2">Daily at 7 AM</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                            Start your day with a clear view of the tech landscape in under 5 minutes.
                        </p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </div>
                        <h3 className="font-semibold mb-2">Exclusive Insights</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                            Get deep analysis and industry perspective not available on the main feed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
