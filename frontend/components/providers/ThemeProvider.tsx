"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Removed the console.error override to ensure cleaner hydration reporting

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
