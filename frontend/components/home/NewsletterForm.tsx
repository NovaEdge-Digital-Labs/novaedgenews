'use client';

import React from 'react';

export const NewsletterForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for newsletter subscription can be added here
        console.log('Newsletter subscription submitted');
    };

    return (
        <form className="space-y-3 relative z-10" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-600 text-sm"
                required
            />
            <button
                type="submit"
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-gray-200 transition-all text-[11px]"
            >
                Subscribe Free
            </button>
        </form>
    );
};
