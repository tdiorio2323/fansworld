'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import GlassCard from '@/components/GlassCard'
import FrostedButton from '@/components/FrostedButton'
import creatorsData from '@/mocks/creators.json'
import { useExploreStore } from '@/lib/stores/explore-store'

const PAGE_SIZE = 6

type Creator = (typeof creatorsData.creators)[number]

export default function Explore() {
  const { query, genre, page, setQuery, setGenre, setPage, reset } = useExploreStore()

  const genres = useMemo(() => {
    const unique = Array.from(new Set(creatorsData.creators.map((creator) => creator.genre)))
    return ['All', ...unique]
  }, [])

  const filtered = useMemo(() => {
    return creatorsData.creators.filter((creator) => {
      const matchesGenre = genre ? creator.genre === genre : true
      const matchesQuery = `${creator.displayName} ${creator.username} ${creator.tagline}`
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchesGenre && matchesQuery
    })
  }, [genre, query])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl">Explore creators</h1>
          <p className="text-sm text-white/70">Browse luxury studios staged with mock data. Payments and auth pending.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {genres.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGenre(option === 'All' ? null : option)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                (option === 'All' && !genre) || option === genre
                  ? 'border-white/60 bg-white/10 text-white'
                  : 'border-white/20 text-white/70 hover:border-white/40'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <div className="glass flex flex-col gap-3 rounded-2xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search creators"
          className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 placeholder:text-white/40 focus:border-white/60"
        />
        <FrostedButton size="sm" onClick={reset} className="shrink-0">
          Reset
        </FrostedButton>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((creator: Creator) => (
          <Link key={creator.username} href={`/creator/${creator.username}`}>
            <GlassCard>
              <div
                className="relative h-40 rounded-xl border border-white/10"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(11,14,19,0.05), rgba(11,14,19,0.85)), url(${creator.cover})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl">{creator.displayName}</h2>
                  <p className="text-sm text-white/60">@{creator.username} · {creator.genre}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  ${creator.price}/mo
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">{creator.tagline}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                <span>{creator.posts} posts</span>
                <span>{creator.subs.toLocaleString()} members</span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <FrostedButton
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </FrostedButton>
        <span className="text-sm text-white/70">
          Page {page} of {totalPages}
        </span>
        <FrostedButton
          size="sm"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </FrostedButton>
      </div>
    </div>
  )
}
