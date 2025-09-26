import { type PropsWithChildren } from 'react'

export default function GlassCard({ children }: PropsWithChildren) {
  return <div className="glass rounded-2xl border border-white/10 p-6 shadow-glass">{children}</div>
}
