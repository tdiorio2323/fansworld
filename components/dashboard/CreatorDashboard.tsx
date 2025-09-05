
'use client'
import { useState } from 'react'
import { Input, Button } from '@/components/ui' // Assuming shadcn/ui components

// Mock data types - replace with your actual Prisma/Supabase types
interface User {
  revenue?: number;
  subs?: number;
  nextPayout?: string;
  price?: number;
}

interface Upload {
  id: string;
  thumb: string;
  title?: string;
  fileName: string;
  views?: number;
  price?: number;
  link: string;
}

interface CreatorDashboardProps {
  user: User;
  uploads: Upload[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export function CreatorDashboard({ user, uploads, onUpload, onDelete }: CreatorDashboardProps) {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="panel-glass max-w-4xl mx-auto rounded-2xl p-6 md:p-8 border border-white/10 shadow-neon-violet flex flex-col gap-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel-glass rounded-xl p-6 flex flex-col items-center justify-center border border-white/10">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Revenue</span>
          <span className="text-iridescent text-4xl font-bold mt-1">${user?.revenue?.toLocaleString() ?? '0'}</span>
        </div>
        <div className="panel-glass rounded-xl p-6 flex flex-col items-center justify-center border border-white/10">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Subscribers</span>
          <span className="text-iridescent text-4xl font-bold mt-1">{user?.subs ?? 0}</span>
        </div>
        <div className="panel-glass rounded-xl p-6 flex flex-col items-center justify-center border border-white/10">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Next Payout</span>
          <span className="text-2xl font-bold text-white mt-2">{user?.nextPayout ?? '-'}</span>
        </div>
      </div>

      {/* Upload Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (file && onUpload) onUpload(file)
        }}
        className="panel-glass border border-white/10 rounded-xl flex flex-col gap-4 px-5 py-7 justify-center items-center"
      >
        <label className="w-full cursor-pointer text-center">
          <input
            type="file"
            accept="image/*,video/*,audio/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="p-6 border-2 border-dashed border-neon-aqua/50 rounded-lg hover:bg-white/5 transition-colors">
            {file ? (
              <div>
                <span className="text-white font-semibold">Selected:</span>
                <span className="ml-2 text-fuchsia-400 font-bold">{file.name}</span>
              </div>
            ) : (
              <span className="text-slate-300 font-semibold text-lg">Tap or drag to upload exclusive content</span>
            )}
          </div>
        </label>
        {file && (
          <Button type="submit" className="w-full md:w-1/2 py-3 bg-iridescent text-black font-bold mt-2 shadow-neon-aqua text-lg">
            Save & Paywall
          </Button>
        )}
      </form>

      {/* Published Content Section */}
      <div>
        <h2 className="text-2xl font-bold text-iridescent mb-4">Your VIP Content</h2>
        <div className="flex flex-col gap-4">
          {uploads?.length > 0 ? (
            uploads.map((up) => (
              <div
                key={up.id}
                className="panel-glass rounded-lg flex items-center justify-between p-4 border-l-4 border-neon-violet shadow-lg"
              >
                <img src={up.thumb} alt="media" className="h-14 w-14 rounded-md object-cover border border-white/10" />
                <div className="flex-1 mx-4">
                  <div className="font-semibold text-white truncate">{up.title ?? up.fileName}</div>
                  <div className="text-slate-400 text-xs">
                    {up.views ?? 0} views · ${up.price ?? user.price} /mo
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(up.link)} className="text-white border-white/20 hover:bg-white/10">
                    Preview
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(up.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 panel-glass rounded-lg border border-white/10">
                <p className="text-slate-300">You haven't uploaded any content yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
