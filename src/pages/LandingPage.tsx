import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gem, Crown, Shield } from 'lucide-react'
import { supabase } from '@/integrations/supabase/supabase'
import { generateSecureVipCode, sanitizeErrorMessage, checkRateLimit } from '@/lib/security'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CrystalSpinner } from '@/components/ui/loading'

const LandingPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Rate limiting check
    if (!checkRateLimit(`email-${email}`, 3, 300000)) { // 3 attempts per 5 minutes
      setError('Too many attempts. Please try again in a few minutes.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Generate cryptographically secure VIP code with collision detection
      const vipCode = await generateSecureVipCode()
      
      // Generate secure passcode
      const passcode = crypto.randomUUID().substring(0, 10)
      
      // Create invite in the existing invites table
      const { error: supabaseError } = await supabase
        .from('invites')
        .insert([
          { 
            invite_code: vipCode,
            passcode: passcode,
            created_by: 'system',
            intended_for: email,
            description: `Email capture invite for ${email}`,
            max_uses: 1,
            current_uses: 0,
            status: 'active',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])

      if (supabaseError) {
        setError(sanitizeErrorMessage(supabaseError))
        return
      }

      // Redirect to VIP entry with code
      navigate(`/vip?code=${vipCode}`)
      
    } catch (err) {
      setError(sanitizeErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div 
      className="min-h-screen w-screen text-white overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0A0B14 0%, #1A0B2E 20%, #C77DFF 40%, #FF006E 60%, #B400FF 80%, #0A0B14 100%)',
      }}
    >
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Centered Member Login Card */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <Card variant="crystal" className="p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fade-in">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-white rotate-45 rounded-sm"></div>
              <span className="text-3xl font-light italic text-white">Cabana</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">MEMBER LOGIN</h1>
            <p className="text-white/70 text-sm">VIP access for authorized members</p>
          </div>

          {/* VIP Access Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                VIP Access Code
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="VIP ACCESS CODE"
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 text-center tracking-widest uppercase text-sm font-medium"
                  maxLength={100}
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="text-red-300 text-center text-sm bg-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}
            
            {/* Access Platform Button */}
            <Button 
              type="submit"
              disabled={isLoading || !email}
              variant="luxury"
              size="lg"
              className="w-full tracking-wide text-base font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <CrystalSpinner size="sm" />
                  Verifying Access...
                </div>
              ) : (
                <>
                  Access Platform
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </Button>
          </form>
          
          {/* Back Link */}
          <div className="text-center mt-6">
            <Link 
              to="/auth" 
              className="text-white/60 hover:text-white/80 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to member login
            </Link>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-white/20">
            <p className="text-white/50 text-xs">Powered by TD Studios</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LandingPage 