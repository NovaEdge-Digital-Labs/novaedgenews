import Link from "next/link"
import { categories } from "@/lib/data"

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-white/[0.01] py-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                            NOVA<span className="text-blue-500">EDGE</span>
                        </Link>
                        <p className="mt-6 text-[13px] text-gray-500 leading-relaxed max-w-xs">
                            High-signal news for the digital vanguard. Technical deep-dives, AI industry analysis, and modern tech perspectives.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6">Briefings</h3>
                        <ul className="space-y-3 text-[13px] text-gray-500">
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link href={`/category/${cat.slug}`} className="hover:text-blue-400 transition-colors">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6">Platform</h3>
                        <ul className="space-y-3 text-[13px] text-gray-500">
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">Intelligence</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-6">Connect</h3>
                        <p className="text-[13px] text-gray-500 mb-6 font-medium">Join our weekly technical brief.</p>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none grow font-medium placeholder:text-gray-600"
                            />
                            <button
                                type="submit"
                                className="bg-white text-black rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] text-gray-600" suppressHydrationWarning>
                        © {new Date().getFullYear()} NovaEdge Intelligence. All rights reserved.
                    </p>
                    <div className="flex space-x-8 text-[12px] text-gray-600">
                        <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                        <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
