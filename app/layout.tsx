import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Chizunet Blog",
  description: "A minimalist technical blog powered by GitHub Issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${outfit.className} ${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-cheese-50 dark:bg-stone-950 text-cheese-950 dark:text-cheese-50 transition-colors duration-700 ease-theme">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl relative z-10">
              {children}
            </main>
            <footer className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-cheese-200/50 dark:border-stone-800/50 backdrop-blur-md">
              <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-lg font-black text-cheese-900 dark:text-cheese-100 mb-2 tracking-tighter">CHIZUNET.CC</h3>
                <p>© {new Date().getFullYear()} Chizukuo. Built with Next.js & GitHub Issues.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
