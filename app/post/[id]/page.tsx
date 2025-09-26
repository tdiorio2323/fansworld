'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/GlassCard'
import FrostedButton from '@/components/FrostedButton'
import GlassModal from '@/components/GlassModal'
import postsData from '@/mocks/posts.json'

const relatedLimit = 3

type Post = (typeof postsData)[number]

type Props = {
  params: { id: string }
}

export default function PostPage({ params }: Props) {
  const [isModalOpen, setModalOpen] = useState(false)
  const post = useMemo<Post | undefined>(() => postsData.find((item) => String(item.id) === params.id), [params.id])

  const related = useMemo<Post[]>(() => {
    if (!post) return []
    return postsData.filter((item) => item.creator === post.creator && item.id !== post.id).slice(0, relatedLimit)
  }, [post])

  if (!post) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl">Post not found</h1>
        <p className="text-white/70">Select a post from a creator gallery to view details.</p>
        <Link href="/explore" className="inline-block">
          <FrostedButton size="lg">Browse creators</FrostedButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
      <GlassCard>
        <div
          className="aspect-video w-full rounded-3xl border border-white/10"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.2), rgba(11,14,19,0.8)), url(${post.media})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="mt-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl">{post.title}</h1>
            <p className="mt-3 max-w-xl text-sm text-white/70">{post.summary}</p>
          </div>
          {post.locked ? (
            <FrostedButton size="lg" onClick={() => setModalOpen(true)}>
              Unlock ${post.price}
            </FrostedButton>
          ) : (
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">Included</span>
          )}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <h2 className="font-display text-2xl">More from this creator</h2>
        <div className="space-y-4">
          {related.map((item) => (
            <Link key={item.id} href={`/post/${item.id}`}>
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div
                    className="h-20 w-20 flex-shrink-0 rounded-xl border border-white/10"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.2), rgba(11,14,19,0.8)), url(${item.media})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div>
                    <p className="font-display text-lg">{item.title}</p>
                    <p className="text-xs text-white/60">{item.locked ? `Unlock ${item.price}` : 'Preview'}</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>

      <GlassModal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="font-display text-2xl">Integration pending</h2>
        <p className="mt-3 text-sm text-white/70">
          For now, use this modal to validate copy, glass treatments, and button states for the unlock experience.
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
