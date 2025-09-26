export default function LoadingExplore() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-2/3 animate-pulse rounded-full bg-white/10" />
      <div className="glass flex flex-col gap-3 rounded-2xl border border-white/10 p-4">
        <div className="h-10 w-full animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  )
}
