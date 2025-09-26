import React, { type PropsWithChildren } from 'react'

type Tone = 'glass' | 'frost' | 'ink'

export default function Card({ children, tone = 'glass', className = '' }: PropsWithChildren<{ tone?: Tone; className?: string }>) {
  const toneClass =
    tone === 'glass' ? 'glass' : tone === 'frost' ? 'frost' : 'bg-cabana-ink/70 border border-white/10 shadow-ring'

  return <div className={`${toneClass} rounded-2xl p-6 ${className}`}>{children}</div>
}
