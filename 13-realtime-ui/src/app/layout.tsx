import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookstore — Live",
  description: "Module 13 — Real-Time UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-gray-900">Bookstore</a>
            <div className="space-x-4">
              <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
