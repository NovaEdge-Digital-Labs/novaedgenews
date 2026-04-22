"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

const newsItems = [
    "SpaceX successfully launches Falcon Heavy with a revolutionary payload.",
    "New breakthrough in Alzheimers research shows promising results.",
    "Global markets brace for potential interest rate changes next week.",
    "Artificial Intelligence reaches new milestone in logical reasoning.",
]

export function BreakingNews() {
    return (
        <div className="premium-glass bg-white/[0.01] py-2.5 overflow-hidden border-y border-white/5">
            <div className="max-w-6xl mx-auto px-6 flex items-center">
                <div className="flex items-center gap-1.5 shrink-0 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 mr-6">
                    <Zap className="h-3 w-3 text-blue-400 fill-blue-400/20" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Update</span>
                </div>
                <div className="relative flex-grow overflow-hidden h-5">
                    <motion.div
                        animate={{ x: ["5%", "-100%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 35,
                            ease: "linear",
                        }}
                        className="absolute whitespace-nowrap top-0"
                    >
                        {newsItems.map((item, i) => (
                            <span key={i} className="mx-10 text-[13px] text-gray-400 font-medium tracking-wide">
                                {item}
                                <span className="ml-10 text-gray-800">•</span>
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
