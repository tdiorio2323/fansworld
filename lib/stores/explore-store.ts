'use client'

import { create } from 'zustand'

interface ExploreState {
  query: string
  genre: string | null
  page: number
  setQuery: (value: string) => void
  setGenre: (value: string | null) => void
  setPage: (value: number) => void
  reset: () => void
}

export const useExploreStore = create<ExploreState>((set) => ({
  query: '',
  genre: null,
  page: 1,
  setQuery: (value) => set({ query: value, page: 1 }),
  setGenre: (value) => set({ genre: value, page: 1 }),
  setPage: (value) => set({ page: value }),
  reset: () => set({ query: '', genre: null, page: 1 }),
}))
