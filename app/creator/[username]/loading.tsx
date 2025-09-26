export default function LoadingCreator() {
  return (
    <div className="space-y-8">
      <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
      <div className="glass rounded-3xl border border-white/10 p-6">
        <div className="h-10 w-1/3 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass aspect-[4/5] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  )
}
