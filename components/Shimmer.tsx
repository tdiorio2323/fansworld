export default function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
