import React from 'react'

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-1 rounded-full border-white/15 px-3 py-1 text-xs">
      {children}
    </span>
  )
}
