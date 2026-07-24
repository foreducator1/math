import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Retro Edu App",
  description: "나만의 교육용 웹앱 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pressStart2P.variable} antialiased min-h-screen flex flex-col font-retro`}
      >
        <header className="w-full p-4 border-b-4 border-white flex items-center justify-between">
          <h1 className="text-xl md:text-2xl text-neon-green">EDU APP</h1>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-pixel-pink transition-colors">Home</a>
            <a href="#" className="hover:text-bright-yellow transition-colors">About</a>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="w-full p-4 border-t-4 border-white text-center text-sm text-gray-400">
          © 2026 Retro Edu. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
