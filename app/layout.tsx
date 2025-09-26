import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { createMetadata, siteConfig } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata: Metadata = createMetadata({
  title: 'Cabana — Creator Platform Demo',
  description: siteConfig.description,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0E13',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body
        className="min-h-dvh bg-obsidian text-white"
        style={{ '--holo': 'linear-gradient(135deg,#5BC0EB,#A691FF,#67E0C4)' } as CSSProperties}
      >
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        <Nav />
        <main className="mx-auto mt-10 w-full max-w-6xl px-4 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
