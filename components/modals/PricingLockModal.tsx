'use client'
import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type PricingLockModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  price: number | string
  note?: string
}

export default function PricingLockModal({
  open,
  onClose,
  title = 'Unlock content',
  price,
  note = 'Payments pending. UI preview only.'
}: PricingLockModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60" onClick={onClose}>
      <div className="glass w-[92%] max-w-md overflow-hidden rounded-2xl p-0" onClick={(event) => event.stopPropagation()}>
        <div className="bg-lux-holo h-1.5" />
        <Card className="p-6">
          <h3 className="font-display text-3xl mb-1">{title}</h3>
          <p className="text-white/70 mb-4">
            Price <span className="text-cabana-gold font-medium">${price}</span>
          </p>
          <div className="text-white/70 text-sm mb-6">{note}</div>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Close
            </Button>
            <Button onClick={onClose} className="flex-1">
              Continue
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
