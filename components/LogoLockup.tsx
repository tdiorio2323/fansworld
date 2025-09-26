import Image from 'next/image'

export default function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Image src="/brand/cabana-logo.png" alt="Cabana" width={32} height={32} className="rounded-full" />
      {!compact && <span className="font-display text-2xl tracking-wide">CABANA</span>}
    </div>
  )
}
