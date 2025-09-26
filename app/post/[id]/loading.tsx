export default function LoadingPost() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <div className="aspect-video animate-pulse rounded-3xl bg-white/10" />
        <div className="h-10 w-1/2 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  )
}
