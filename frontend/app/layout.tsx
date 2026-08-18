import type { Metadata } from "next";
import Script from "next/script";
import { SITE } from "@/constants/site";

import "./globals.css";

import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/article/ReadingProgress";

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: SITE.title,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    keywords: [...SITE.keywords],
    authors: [
        {
            name: SITE.author.name,
        },
    ],
    creator: SITE.author.name,
    openGraph: {
        title: SITE.title,
        description: SITE.description,
        url: SITE.url,
        siteName: SITE.name,
        images: [
            {
                url: SITE.defaultImage,
            },
        ],
        locale: SITE.locale,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE.title,
        description: SITE.description,
        images: [SITE.defaultImage],
    },
    alternates: {
        canonical: SITE.url,
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: [
            { url: "/icon.png", type: "image/png" },
            { url: "/favicon.ico" },
        ],
        shortcut: "/icon.png",
        apple: "/apple-icon.png",
    },
};

interface RootLayoutProps {
    readonly children: React.ReactNode;
}

export default function RootLayout({
    children,
}: RootLayoutProps) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className="font-sans"
        >
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2701940262314279"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-2M3WW77PVZ"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-2M3WW77PVZ');
                    `}
                </Script>
            </head>
            <body
                className="
                    font-sans
                    antialiased
                    bg-background
                    text-foreground
                "
            >
                <Providers>
                    <ReadingProgress />

                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}