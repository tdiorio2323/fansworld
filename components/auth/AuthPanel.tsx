
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Input, Button } from '@/components/ui' // Assuming shadcn/ui components are in this path

export function AuthPanel() {
  const [email, setEmail] = useState('')
  const [vip, setVip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stage, setStage] = useState<'email' | 'vip' | 'success'>('email')

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('email', { email, redirect: false })
    if (res?.error) {
      setError('Failed to send magic link. Please try again.')
    } else {
      // For this flow, we'll assume successful email submission leads to a "Check your inbox" message
      setStage('success')
    }
    setLoading(false)
  }

  async function handleVIP(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { vip, redirect: false })
    if (res?.error) {
      setError('Invalid VIP code. Please check and try again.')
    } else {
      setStage('success')
    }
    setLoading(false)
  }

  return (
    <div className="panel-glass max-w-md w-full mx-auto mt-8 px-8 py-10 rounded-2xl border border-white/10 shadow-neon-violet flex flex-col items-center">
      <img src="/logo-mark.svg" alt="Cabana Mark" className="w-16 h-16 mb-4" />
      <h1 className="text-iridescent text-4xl font-extrabold mb-2 tracking-wide uppercase">CABANA</h1>
      <p className="text-lg mb-6 text-slate-300 text-center font-light">The VIP Link Platform.</p>

      {error && (
        <div className="mt-1 mb-4 text-sm bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-2 w-full rounded-lg shadow-inner flex items-center gap-3">
          <span>🚨</span> {error}
        </div>
      )}

      {stage === 'email' && (
        <form onSubmit={handleEmail} className="w-full space-y-4">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="panel-glass border-white/10 h-12 text-center text-lg"
            type="email"
            autoComplete="email"
            required
          />
          <Button type="submit" disabled={loading} className="bg-iridescent text-black w-full h-12 text-lg font-bold shadow-neon-aqua hover:opacity-90 transition-opacity">
            {loading ? 'Sending...' : 'Continue with Email'}
          </Button>
          <div className="text-center">
            <Button type="button" variant="link" className="text-slate-400" onClick={() => setStage('vip')}>
              Have a VIP Code?
            </Button>
          </div>
        </form>
      )}

      {stage === 'vip' && (
        <form onSubmit={handleVIP} className="w-full space-y-4">
          <Input
            placeholder="ENTER VIP CODE"
            value={vip}
            onChange={(e) => setVip(e.target.value)}
            className="panel-glass border-white/10 h-14 text-center text-2xl tracking-widest font-black"
            required
          />
          <Button type="submit" disabled={loading} className="bg-iridescent text-black w-full h-12 text-lg font-bold shadow-neon-violet">
            {loading ? 'Verifying...' : 'Unlock VIP Access'}
          </Button>
          <div className="text-center">
            <Button type="button" variant="link" className="text-slate-400" onClick={() => setStage('email')}>
              Back to Email Login
            </Button>
          </div>
        </form>
      )}

      {stage === 'success' && (
        <div className="text-center p-4 my-6">
          <h2 className="text-iridescent text-2xl font-bold">Check Your Inbox</h2>
          <p className="text-slate-300 mt-2">We've sent a magic link to your email address.</p>
        </div>
      )}
    </div>
  )
}
