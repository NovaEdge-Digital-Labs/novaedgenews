import Navigation from "@/components/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-black tracking-tighter text-blue-500">ADMIN</span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-sm font-bold text-slate-400">NovaEdge Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Logged in as admin</span>
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50" />
                    </div>
                </div>
            </header>
            <main className="grow">{children}</main>
            <Footer />
        </div>
    );
}
