'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import CreatorHeader from '@/components/CreatorHeader'
import GlassModal from '@/components/GlassModal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
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
  const [tab, setTab] = useState<'posts' | 'about'>('posts')

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
          <Button size="lg">Go to Explore</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <CreatorHeader
        cover={creator.cover}
        displayName={creator.displayName}
        username={creator.username}
        stats={{ posts: creator.posts, subs: creator.subs, price: creator.price }}
        onSubscribe={() => setModalOpen(true)}
      />
      <Card className="!p-2">
        <div className="inline-flex gap-1 rounded-full bg-white/10 p-1">
          <button
            type="button"
            onClick={() => setTab('posts')}
            className={`rounded-full px-4 py-1.5 text-sm transition ${tab === 'posts' ? 'frost text-white' : 'bg-transparent text-white/70'}`}
          >
            Posts
          </button>
          <button
            type="button"
            onClick={() => setTab('about')}
            className={`rounded-full px-4 py-1.5 text-sm transition ${tab === 'about' ? 'frost text-white' : 'bg-transparent text-white/70'}`}
          >
            About
          </button>
        </div>
      </Card>

      {tab === 'posts' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creatorPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <Card className="!p-0 overflow-hidden">
                <div
                  className="aspect-[4/5] w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.1), rgba(11,14,19,0.75)), url(${post.media})`,
                  }}
                />
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-display text-lg">{post.title}</p>
                    <p className="text-xs text-white/60">{post.locked ? 'Locked preview' : 'Public preview'}</p>
                  </div>
                  {post.locked ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Unlock ${post.price}</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Free</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <h3 className="mb-2 font-display text-2xl">About {creator.displayName}</h3>
          <p className="text-white/75">Creator bio placeholder. UI preview only.</p>
        </Card>
      )}

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
