"use client"

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

type Props = {
  cover: string
  displayName: string
  username: string
  stats?: { posts?: number; subs?: number; price?: number }
  onSubscribe?: () => void
}

export default function CreatorHeader({ cover, displayName, username, stats = {}, onSubscribe }: Props) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handler = () => setOffset(window.scrollY)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const parallax = Math.min(offset * 0.25, 80)

  return (
    <div className="glass relative overflow-hidden rounded-3xl">
      <div
        className="h-60 w-full bg-cover bg-center md:h-80"
        style={{ backgroundImage: `url(${cover})`, transform: `translateY(${parallax * -0.6}px)` }}
        aria-hidden
      />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl leading-none md:text-6xl">{displayName}</h1>
            <p className="text-white/70">@{username}</p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="!p-3 flex gap-4 text-sm">
              {typeof stats.posts === 'number' && <span>{stats.posts} posts</span>}
              {typeof stats.subs === 'number' && <span>{stats.subs} subs</span>}
              {typeof stats.price === 'number' && (
                <span className="font-semibold text-cabana-gold">${stats.price}/mo</span>
              )}
            </Card>
            <Button size="lg" onClick={onSubscribe}>
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
