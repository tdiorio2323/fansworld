"use client"

import { type PropsWithChildren } from 'react'

export default function GlassModal({ open, onClose, children }: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  if (!open || typeof document === 'undefined') return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60" onClick={onClose}>
      <div className="glass w-[92%] max-w-md rounded-2xl p-6" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
