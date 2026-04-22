"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Menu, X, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full transition-all duration-500",
            isScrolled
                ? "premium-glass py-3"
                : "bg-transparent py-5"
        )}>
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Left: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center group">
                            <span className="text-xl font-bold tracking-[-0.05em] text-blue-500 group-hover:opacity-80 transition-opacity">
                                NOVA<span className="text-foreground">EDGE</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center justify-center space-x-6 flex-auto">
                        {categories.slice(0, 5).map((category) => (
                            <Link
                                key={category.slug}
                                href={`/category/${category.slug}`}
                                className="text-[13px] font-medium tracking-wide text-gray-400 hover:text-foreground transition-all"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end items-center space-x-3">
                        <button className="p-2 rounded-full hover:bg-white/5 text-gray-400/70 hover:text-foreground transition-all md:block hidden" aria-label="Search">
                            <Search className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/5 text-gray-400/70 hover:text-foreground transition-all relative" aria-label="Notifications">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary/80 ring-2 ring-background"></span>
                        </button>
                        <ThemeToggle />

                        {/* Mobile Menu Toggle */}
                        <button
                            className="p-2 rounded-full hover:bg-white/5 text-gray-400/70 hover:text-foreground md:hidden transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden premium-glass border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col space-y-5">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/category/${category.slug}`}
                                className="text-lg font-semibold text-gray-400 hover:text-foreground transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
