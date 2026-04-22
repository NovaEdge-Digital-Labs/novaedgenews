"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { Article } from "@/lib/data"
import { cn } from "@/lib/utils"
import { trackImpression, trackClick } from "@/lib/api"

interface HeroCarouselProps {
    articles: Article[]
    className?: string
}

export function HeroCarousel({ articles, className }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [direction, setDirection] = React.useState(0)
    const trackedSlides = React.useRef<Set<string>>(new Set())

    const nextSlide = React.useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, [articles.length])

    const prevSlide = React.useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
    }, [articles.length])

    React.useEffect(() => {
        const timer = setInterval(nextSlide, 8000)
        return () => clearInterval(timer)
    }, [nextSlide])

    const currentArticle = articles[currentIndex]

    // Track impression of the active slide
    React.useEffect(() => {
        if (currentArticle && currentArticle._id && currentArticle.variant && !trackedSlides.current.has(currentArticle._id)) {
            trackedSlides.current.add(currentArticle._id)
            trackImpression(currentArticle._id, currentArticle.variant)
        }
    }, [currentIndex, currentArticle])

    const handleReadMoreClick = () => {
        if (currentArticle && currentArticle._id && currentArticle.variant) {
            trackClick(currentArticle._id, currentArticle.variant)
        }
    }

    const variants: any = {
        enter: (direction: number) => ({
            x: direction > 0 ? "50%" : "-50%",
            opacity: 0,
            scale: 1.05
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.6 },
                scale: { duration: 0.8, ease: "easeOut" }
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "50%" : "-50%",
            opacity: 0,
            scale: 1.05,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.6 },
                scale: { duration: 0.8, ease: "easeIn" }
            }
        })
    }

    return (
        <div className={cn("relative group overflow-hidden rounded-[2.5rem] premium-glass h-[600px] md:h-[700px]", className)}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={currentArticle.image}
                        alt={currentArticle.displayTitle || currentArticle.title}
                        fill
                        className="object-cover transition-transform duration-[10000ms] ease-linear scale-110 group-hover:scale-100"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <span className="premium-glass px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 mb-8 inline-block">
                                {currentArticle.category}
                            </span>

                            <div className="flex items-center space-x-6 mb-8 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                <span className="flex items-center"><User className="h-3.5 w-3.5 mr-2 opacity-50" /> {currentArticle.author}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-2 opacity-50" /> {currentArticle.readingTime}</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter mb-8 text-white">
                                {currentArticle.displayTitle || currentArticle.title}
                            </h2>

                            <p className="text-lg md:text-xl text-gray-400 mb-12 line-clamp-2 max-w-2xl leading-relaxed font-medium">
                                {currentArticle.summary}
                            </p>

                            <Link
                                href={`/article/${currentArticle.slug}`}
                                onClick={handleReadMoreClick}
                                className="inline-flex items-center px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 group/btn"
                            >
                                Read Investigation <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-12 z-20">
                <button
                    onClick={prevSlide}
                    className="p-4 rounded-full premium-glass hover:bg-white/10 transition-all text-white/50 hover:text-white group"
                    aria-label="Previous story"
                >
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-12 z-20">
                <button
                    onClick={nextSlide}
                    className="p-4 rounded-full premium-glass hover:bg-white/10 transition-all text-white/50 hover:text-white group"
                    aria-label="Next story"
                >
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-12 right-16 z-20 flex items-center space-x-3">
                {articles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1)
                            setCurrentIndex(index)
                        }}
                        className="relative h-1 group"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div className={cn(
                            "h-full rounded-full transition-all duration-500",
                            currentIndex === index ? "w-12 bg-blue-500" : "w-4 bg-white/20 group-hover:bg-white/40"
                        )} />
                    </button>
                ))}
            </div>
        </div>
    )
}
