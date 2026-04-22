'use client';

import * as React from "react";
import Link from "next/link";
import { Search, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-500",
                isScrolled ? "premium-glass py-3" : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center group">
                            <span className="text-2xl font-black tracking-tight text-primary group-hover:opacity-80 transition-opacity">
                                NOVA<span className="text-foreground">EDGE</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center justify-center space-x-8 flex-auto">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/articles/category/${category.slug}`}
                                className="text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            href="/subscribe"
                            className="text-sm font-semibold tracking-wide text-primary hover:text-foreground transition-colors uppercase border border-primary/20 bg-primary/5 px-3 py-1 rounded-full"
                        >
                            Newsletter
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex-1 flex justify-end items-center space-x-4">
                        <button
                            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        <button
                            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all relative"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground md:hidden transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="md:hidden premium-glass border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 pt-6 pb-12 flex flex-col space-y-6">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/articles/category/${category.slug}`}
                                className="text-xl font-bold text-muted-foreground hover:text-foreground transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            href="/subscribe"
                            className="text-xl font-bold text-primary hover:text-foreground transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            NEWSLETTER
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
