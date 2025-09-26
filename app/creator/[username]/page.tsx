'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FrostedButton from '@/components/FrostedButton'
import GlassCard from '@/components/GlassCard'
import GlassModal from '@/components/GlassModal'
import PendingFeature from '@/components/PendingFeature'
import creatorsData from '@/mocks/creators.json'
import postsData from '@/mocks/posts.json'

type Creator = (typeof creatorsData.creators)[number]
type Post = (typeof postsData)[number]

export default function CreatorPage({ params }: { params: { username: string } }) {
  const creator = useMemo<Creator | undefined>(
    () => creatorsData.creators.find((item) => item.username === params.username),
    [params.username],
  )
  const [isModalOpen, setModalOpen] = useState(false)

  const creatorPosts = useMemo<Post[]>(() => {
    if (!creator) return []
    return postsData.filter((post) => creator.samplePosts.includes(post.id))
  }, [creator])

  if (!creator) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl">Creator not found</h1>
        <p className="text-white/70">Select a creator from explore to view their showcase.</p>
        <Link href="/explore" className="inline-block">
          <FrostedButton size="lg">Go to Explore</FrostedButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-white/10">
        <div
          className="h-60 w-full bg-cover bg-center md:h-72"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.05), rgba(11,14,19,0.85)), url(${creator.cover})`,
          }}
        />
        <div className="glass flex flex-col gap-4 border-t border-white/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl">{creator.displayName}</h1>
            <p className="text-sm text-white/70">@{creator.username} · {creator.genre}</p>
            <p className="mt-3 max-w-2xl text-sm text-white/70">{creator.tagline}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <FrostedButton size="lg" onClick={() => setModalOpen(true)}>
              Subscribe ${creator.price}/mo
            </FrostedButton>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Payments pending
            </p>
          </div>
        </div>
      </section>

      <PendingFeature title="Studio analytics incoming" description="Cabana Studio insights will appear once the analytics pipeline is wired." />

      <section className="space-y-4">
        <h2 className="font-display text-3xl">Gallery</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creatorPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <GlassCard>
                <div
                  className="aspect-[4/5] w-full rounded-2xl border border-white/10"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.1), rgba(11,14,19,0.75)), url(${post.media})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl">{post.title}</p>
                    <p className="text-xs text-white/60">{post.locked ? 'Locked preview' : 'Public preview'}</p>
                  </div>
                  {post.locked ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      Unlock ${post.price}
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Free</span>
                  )}
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <GlassModal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="font-display text-2xl">Integration pending</h2>
        <p className="mt-3 text-sm text-white/70">
          Once payments land, this button will launch checkout with entitlement syncing across Cabana Studio and the fan
          experience.
        </p>
        <button
          type="button"
          className="btn-reset mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </GlassModal>
    </div>
  )
}
