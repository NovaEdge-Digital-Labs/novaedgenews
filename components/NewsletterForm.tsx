"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
    const [categories, setCategories] = useState<string[]>(["tech"]);
    const [receiveDigests, setReceiveDigests] = useState(true);

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleCategoryToggle = (cat: string) => {
        setCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            await subscribeToNewsletter(email, {
                frequency,
                categories,
                receiveDigests,
            }, "homepage");

            setStatus("success");
            setMessage("Check your inbox to confirm your subscription!");
            setEmail("");
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "Failed to subscribe. Please try again.");
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-sm mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Mail size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">NovaEdge News</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Stay updated with AI & Tech</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white transition-all"
                        required
                        disabled={status === "loading" || status === "success"}
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Preferences</label>

                    <div
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 cursor-pointer"
                        onClick={() => setReceiveDigests(!receiveDigests)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Daily Digest</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">Curated morning news</span>
                        </div>
                        <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${receiveDigests ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${receiveDigests ? "translate-x-4" : "translate-x-0"}`} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["tech", "ai", "startups", "business"].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryToggle(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${categories.includes(cat)
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {status === "success" && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-start gap-3 border border-emerald-100 dark:border-emerald-900/50">
                        <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 border border-red-100 dark:border-red-900/50">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "loading" || status === "success" || !email}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    {status === "loading" ? (
                        <><Loader2 className="animate-spin" size={18} /> Subscribing...</>
                    ) : status === "success" ? (
                        "Subscribed!"
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </form>
        </div>
    );
}
