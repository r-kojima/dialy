import type { Metadata } from "next"
import { Noto_Sans_JP, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeToggle } from "./components/theme-toggle"
import { Toaster } from "sonner"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "個人日記",
  description: "マークダウン形式で記録する個人日記",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeToggle />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
