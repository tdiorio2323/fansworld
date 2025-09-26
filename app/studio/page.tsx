'use client'

import { Button, Card } from '@/components/ui'
import UploaderMock from '@/components/studio/UploaderMock'

export default function StudioPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl">Cabana Studio</h1>
          <p className="text-sm text-white/70">Creator tooling preview only. Onboarding unlocks during integration phase.</p>
        </div>
        <Button size="sm" variant="ghost" disabled>
          Launch studio
        </Button>
      </header>

      <Card>
        <h2 className="font-display text-2xl">Creator tools pending</h2>
        <p className="mt-2 text-sm text-white/70">
          Monetization, analytics, and entitlement flows will appear once auth and payments are wired.
        </p>
      </Card>

      <UploaderMock />
    </div>
  )
}
