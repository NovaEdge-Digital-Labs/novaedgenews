"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeFromNewsletter } from "@/lib/api";
import Link from "next/link";

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing unsubscribe token.");
            return;
        }

        const performUnsubscribe = async () => {
            try {
                await unsubscribeFromNewsletter(token);
                setStatus("success");
            } catch (error: any) {
                setStatus("error");
                setMessage(error.message || "Failed to unsubscribe. Please try again.");
            }
        };

        performUnsubscribe();
    }, [token]);

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-10 shadow-sm">
                {status === "loading" && (
                    <>
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-2xl font-bold mb-2">Unsubscribing...</h1>
                        <p className="text-muted-foreground">Please wait while we process your request.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Unsubscribed</h1>
                        <p className="text-muted-foreground mb-8">
                            You have been successfully removed from our mailing list. You won't receive any more newsletters from us.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Back to Home
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-muted-foreground mb-8 text-pretty">{message}</p>
                        <Link
                            href="/"
                            className="inline-block border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                        >
                            Back to Home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnsubscribeContent />
        </Suspense>
    );
}
