import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import dynamic from 'next/dynamic';

const Background = dynamic(() => import("@/components/ui/Background"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: false });
import NextTopLoader from 'nextjs-toploader';
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.chizunet.cc'),
  title: {
    default: "Chizunet Blog",
    template: "%s | Chizunet Blog"
  },
  description: "A space where logic meets life. Documenting technology, art, and the resonance between them.",
  keywords: ["Blog", "Technology", "Computer Science", "Design", "GitHub Issues CMS", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Chizukuo", url: "https://github.com/Chizukuo" }],
  creator: "Chizukuo",
  publisher: "Chizukuo",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Chizunet Blog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chizunet Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@chizukuo",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // userScalable: true is the a11y-friendly default; allow pinch-to-zoom
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBEB' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { lang?: string };
}>) {
  const lang = params?.lang || "zh";
  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <body className={`${outfit.className} ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NextTopLoader 
            color="#FFCA28"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #FFCA28,0 0 5px #FFCA28"
          />
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-cheese-500 focus:text-white focus:rounded-xl focus:font-bold focus:shadow-lg"
          >
            Skip to main content
          </a>
          <div className="w-full min-h-screen flex flex-col bg-cheese-50 dark:bg-[#0c0a09] text-cheese-950 dark:text-stone-200 transition-all duration-700 ease-theme-spring relative">
            <Background />
            <Navbar />
            <main id="main-content" className="flex-grow mx-auto w-full max-w-[120rem] px-0 sm:px-6 lg:px-8 py-8 relative z-10">
              {children}
            </main>
            <ScrollToTop />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
