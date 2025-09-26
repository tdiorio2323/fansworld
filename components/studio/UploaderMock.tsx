"use client"

import { useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type Item = { id: string; name: string; progress: number; status: 'queued' | 'uploading' | 'done' | 'error' }

function generateId(index: number) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${index}-${Math.random().toString(16).slice(2, 8)}`
}

export default function UploaderMock() {
  const [items, setItems] = useState<Item[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function enqueue(files: FileList | null) {
    if (!files || files.length === 0) return

    const created = Array.from(files).map((file, index) => ({
      id: generateId(index),
      name: file.name,
      progress: 0,
      status: 'queued' as const,
    }))

    setItems((previous) => [...created, ...previous])
    simulate(created.map((item) => item.id))
  }

  function simulate(ids: string[]) {
    ids.forEach((id, index) => {
      setTimeout(() => tick(id), 150 * index)
    })
  }

  function tick(id: string) {
    let nextProgress = 100

    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item
        const progress = Math.min(item.progress + Math.random() * 22 + 8, 100)
        nextProgress = progress
        return {
          ...item,
          progress,
          status: progress >= 100 ? 'done' : 'uploading',
        }
      }),
    )

    if (nextProgress < 100) {
      requestAnimationFrame(() => tick(id))
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl">Upload media</h2>
          <p className="text-white/70">Direct-to-storage flow will replace this. UI only.</p>
        </div>
        <div className="flex gap-2">
          <input ref={inputRef} type="file" multiple hidden onChange={(event) => enqueue(event.target.files)} />
          <Button onClick={() => inputRef.current?.click()} variant="secondary">
            Select files
          </Button>
          <Button onClick={() => setItems([])} variant="ghost">
            Clear
          </Button>
        </div>
      </div>

      <div
        className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-center"
        onDragOver={(event) => {
          event.preventDefault()
        }}
        onDrop={(event) => {
          event.preventDefault()
          enqueue(event.dataTransfer.files)
        }}
      >
        <p className="text-white/70">Drag & drop here</p>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="truncate pr-4 text-sm">{item.name}</div>
              <div className="text-sm text-white/70">{item.status}</div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-lux-holo" style={{ width: `${item.progress}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
