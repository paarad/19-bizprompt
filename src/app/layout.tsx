import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BizPrompt - AI-Powered Business Ideas',
  description: 'Generate personalized, high-quality business ideas using AI. From side hustles to SaaS, get actionable business concepts in seconds.',
  keywords: ['business ideas', 'AI', 'entrepreneurship', 'startup', 'side hustle', 'SaaS'],
  authors: [{ name: 'BizPrompt' }],
  openGraph: {
    title: 'BizPrompt - AI-Powered Business Ideas',
    description: 'Generate personalized, high-quality business ideas using AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}
