import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Cabana',
  shortName: 'Cabana',
  description: 'Luxury creator subscriptions. UI demo build.',
  url: 'https://demo.cabana',
  twitter: '@cabana',
  ogImage: '/brand/cabana-holo.png',
}

const defaultOpenGraph = {
  type: 'website',
  url: siteConfig.url,
  title: siteConfig.name,
  description: siteConfig.description,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} preview`,
    },
  ],
}

const defaultTwitter = {
  card: 'summary_large_image' as const,
  site: siteConfig.twitter,
  creator: siteConfig.twitter,
  title: siteConfig.name,
  description: siteConfig.description,
  images: [siteConfig.ogImage],
}

export function createMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: overrides.title ?? siteConfig.name,
    description: overrides.description ?? siteConfig.description,
    openGraph: {
      ...defaultOpenGraph,
      ...overrides.openGraph,
      images: overrides.openGraph?.images ?? defaultOpenGraph.images,
    },
    twitter: {
      ...defaultTwitter,
      ...overrides.twitter,
      images: overrides.twitter?.images ?? defaultTwitter.images,
    },
    icons: overrides.icons ?? { icon: '/brand/cabana-logo.png' },
  }
}
