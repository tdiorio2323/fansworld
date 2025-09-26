'use client'

import PendingFeature from '@/components/PendingFeature'
import GlassCard from '@/components/GlassCard'
import FrostedButton from '@/components/FrostedButton'

export default function StudioPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl">Cabana Studio</h1>
          <p className="text-sm text-white/70">Creator tooling preview only. Onboarding unlocks during integration phase.</p>
        </div>
        <FrostedButton size="sm" disabled className="cursor-not-allowed opacity-60">
          Launch studio
        </FrostedButton>
      </header>

      <PendingFeature
        title="Creator tools pending"
        description="Monetization, analytics, and entitlement flows will appear once auth + payments are wired."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Launch Planner',
            copy: 'Stage drops, schedule teasers, and configure pay-per-view releases.',
          },
          {
            title: 'Audience Signals',
            copy: 'Track premium members, VIP unlocks, and curated fan journeys.',
          },
          {
            title: 'Media Vault',
            copy: 'Organize content with luxe metadata and entitlement tags.',
          },
        ].map((tile) => (
          <GlassCard key={tile.title}>
            <h2 className="font-display text-2xl">{tile.title}</h2>
            <p className="mt-3 text-sm text-white/70">{tile.copy}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
