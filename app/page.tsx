'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/GlassCard'
import GlassModal from '@/components/GlassModal'
import Button from '@/components/ui/Button'
import creatorsData from '@/mocks/creators.json'

type Creator = (typeof creatorsData.creators)[number]

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false)
  const featuredCreators = creatorsData.creators.slice(0, 3)

  return (
    <div className="space-y-16">
      <section className="pt-8 text-center md:pt-16">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Cabana Preview</p>
        <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">
          Luxury. Privacy. Control.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
          A UI-first demo of Cabana, the luxury creator studio. Explore the polished flows while Stripe, Supabase,
          and other integrations remain pending.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/explore">
            <Button size="lg" variant="primary">
              Explore Creators
            </Button>
          </Link>
          <Button size="lg" variant="secondary" onClick={() => setModalOpen(true)}>
            Become a Creator
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Curated creators',
            body: 'Hand-picked portfolios with cinematic visuals and concierge moderation.',
          },
          {
            title: 'Entitlement ready',
            body: 'UI flows for subscriptions, PPV drops, and VIP unlocks. Integrations currently pending.',
          },
          {
            title: 'Studio controls',
            body: 'Plan launches, stage media, and preview analytics from the Cabana Studio shell.',
          },
        ].map((feature) => (
          <GlassCard key={feature.title}>
            <h3 className="font-display text-2xl">{feature.title}</h3>
            <p className="mt-3 text-sm text-white/70">{feature.body}</p>
          </GlassCard>
        ))}
      </section>

      <section id="about" className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-4xl">Featured creators</h2>
          <Link href="/explore" className="text-sm uppercase tracking-widest text-white/70 hover:text-white">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCreators.map((creator: Creator) => (
            <GlassCard key={creator.username}>
              <div
                className="relative h-40 rounded-xl border border-white/10"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75)), url(${creator.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl">{creator.displayName}</p>
                  <p className="text-sm text-white/60">@{creator.username}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  ${creator.price}/mo
                </span>
              </div>
              <p className="mt-3 text-sm text-white/65">{creator.tagline}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Creator applications pending"
        description="Cabana Studio onboarding will unlock once the payments and auth stack is ready."
        primaryActionLabel="Close"
      >
        <p className="text-sm text-white/60">
          This build focuses on UI polish. Keep refining the visuals, then layer in Supabase and Stripe when the
          product enters the integration phase.
        </p>
      </GlassModal>
    </div>
  )
}
