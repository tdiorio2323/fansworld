import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gem, Crown, Shield } from 'lucide-react'
import { supabase } from '@/integrations/supabase/supabase'
import { generateSecureVipCode, sanitizeErrorMessage, checkRateLimit } from '@/lib/security'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CrystalSpinner } from '@/components/ui/loading'

const LandingPage = () => {
  const [vipCode, setVipCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vipCode.trim()) return

    // For quick development access
    if (vipCode.trim().toUpperCase() === 'TD') {
      navigate('/discover')
      return
    }

    // Redirect to VIP entry page with the code
    navigate(`/vip?code=${vipCode.trim().toUpperCase()}`)
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
          <form onSubmit={handleVipSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                VIP Access Code
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value.toUpperCase())}
                  placeholder="ENTER VIP CODE"
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 text-center tracking-widest uppercase text-sm font-medium"
                  maxLength={12}
                  required
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handleVipSubmit(e)}
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
              disabled={isLoading || !vipCode.trim()}
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
          
          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-xs">
              Enter your VIP access code above
            </p>
            <p className="text-white/50 text-xs mt-1">
              Try "TD" for quick development access
            </p>
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