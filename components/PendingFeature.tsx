import { type ReactNode } from 'react'

interface PendingFeatureProps {
  title: string
  description: string
  icon?: ReactNode
}

export default function PendingFeature({ title, description, icon }: PendingFeatureProps) {
  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <div className="flex items-start gap-4">
        {icon ? <div className="mt-1 text-2xl text-cabana-gold">{icon}</div> : null}
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="mt-2 text-sm text-white/70">{description}</p>
        </div>
      </div>
    </div>
  )
}
