import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import QueryProvider from "@/components/providers/QueryProvider"
import Navigation from "@/components/Navigation"
import { Footer } from "@/components/layout/Footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME || 'NovaEdge News'} - Tech & AI News`,
  description: 'Daily tech news, AI updates, and startup insights',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech'),

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'NovaEdge News',
    title: `${process.env.NEXT_PUBLIC_SITE_NAME || 'NovaEdge News'} - Tech & AI News`,
    description: 'Daily tech news, AI updates, and startup insights',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: process.env.NEXT_PUBLIC_SITE_NAME || 'NovaEdge News'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    site: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@novaedgenews',
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@novaedgenews',
    title: process.env.NEXT_PUBLIC_SITE_NAME || 'NovaEdge News',
    description: 'Tech & AI news delivered daily',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://novaedge.tech'}/twitter-image.png`]
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://adservice.google.com" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-background text-foreground flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navigation />
            <main className="grow">{children}</main>
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
