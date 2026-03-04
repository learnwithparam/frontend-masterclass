import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookStore - Next.js SSR",
  description: "Module 07: Server-Side Rendering with Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold text-slate-900">📚 BookStore</Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/" className="text-slate-600 hover:text-[#ff4f01]">Catalog</Link>
                <Link href="/login" className="text-slate-600 hover:text-[#ff4f01]">Login</Link>
              </nav>
            </div>
            <span className="text-xs bg-orange-50 text-[#e64600] px-2 py-1 rounded-full font-medium">Next.js SSR</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
