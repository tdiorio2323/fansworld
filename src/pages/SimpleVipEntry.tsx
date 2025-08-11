import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SimpleVipEntry = () => {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedCode = code.trim().toUpperCase()
    
    if (!trimmedCode) {
      alert('Please enter a VIP code')
      return
    }

    // Quick access codes
    if (trimmedCode === 'TD') {
      console.log('TD code entered, navigating to /discover')
      alert('TD code accepted! Redirecting to platform...')
      setTimeout(() => {
        navigate('/discover')
      }, 1000)
      return
    }

    // Redirect to VIP entry page with code
    console.log('Navigating to VIP entry with code:', trimmedCode)
    navigate(`/vip?code=${trimmedCode}`)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background: 'linear-gradient(135deg, #0A0B14 0%, #1A0B2E 20%, #C77DFF 40%, #FF006E 60%, #B400FF 80%, #0A0B14 100%)',
      }}
    >
      <div className="max-w-md w-full mx-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-white rotate-45 rounded-sm mr-3"></div>
              <h1 className="text-2xl font-light italic text-white">Cabana</h1>
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-1">
              VIP ACCESS
            </h2>
            <p className="text-sm text-white/70">
              Enter your VIP code below
            </p>
          </div>

          {/* Simple Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <input
                type="text"
                name="vip-access-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ENTER VIP CODE"
                autoComplete="one-time-code"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                pattern="[A-Za-z0-9]*"
                maxLength={20}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-center tracking-widest uppercase font-medium"
                style={{ textTransform: 'uppercase' }}
                data-testid="vip-code-input"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 border-0 rounded-2xl py-4 text-white font-semibold transition-all duration-200"
            >
              Access Platform →
            </button>
          </form>
          
          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-xs">
              Try "TD" for quick access
            </p>
            <p className="text-white/50 text-xs mt-2">
              Or <button 
                onClick={() => navigate('/discover')} 
                className="underline text-white/70 hover:text-white"
              >
                click here to go directly to platform
              </button>
            </p>
          </div>
          
          <div className="text-center mt-6 pt-4 border-t border-white/20">
            <p className="text-white/50 text-xs">Powered by TD Studios</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleVipEntry