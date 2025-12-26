import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Background from "@/components/ui/Background";
import Logo from "@/components/ui/Logo";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.chizunet.cc'),
  title: {
    default: "Chizunet Blog",
    template: "%s | Chizunet Blog"
  },
  description: "A minimalist technical blog powered by GitHub Issues, exploring computer science, design, and technology.",
  keywords: ["Blog", "Technology", "Computer Science", "Design", "GitHub Issues CMS", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Chizukuo", url: "https://github.com/Chizukuo" }],
  creator: "Chizukuo",
  publisher: "Chizukuo",
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
          <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-cheese-50 dark:bg-[#0c0a09] text-cheese-950 dark:text-stone-200 transition-all duration-700 ease-theme-spring relative">
            <Background />
            <Navbar />
            <main className="flex-grow mx-auto w-full max-w-[120rem] px-0 sm:px-6 lg:px-8 py-8 relative z-10">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-cheese-200/50 dark:border-stone-800/50 backdrop-blur-md relative z-10">
              <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Logo compact />
                  <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
                    <a href="https://chizunet.cc" target="_blank" rel="noopener noreferrer" className="hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors">
                      Personal Site
                    </a>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <a href="https://github.com/Chizukuo" target="_blank" rel="noopener noreferrer" className="hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors">
                      GitHub
                    </a>
                  </div>
                </div>

                <p className="opacity-60 mt-2 md:mt-0">© {new Date().getFullYear()} Chizukuo. Built with Next.js & GitHub Issues.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
