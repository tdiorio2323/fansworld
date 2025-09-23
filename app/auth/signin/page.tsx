'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Crown,
  Sparkles,
  Shield,
  ArrowRight
} from 'lucide-react'

import { EnhancedGlassCard, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Mock authentication - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate success/failure
      if (formData.email && formData.password) {
        // Success - redirect to dashboard
        router.push('/dashboard')
      } else {
        setError('Please enter both email and password')
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // Mock Google sign-in
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400/10 via-purple-500/8 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-400/10 via-blue-500/8 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="mb-4 sm:mb-6">
            <HolographicLogo size="lg" animated={true} showText={true} variant="default" />
          </div>
          <h1 className="font-bebas text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Sign in to your luxury creator empire
          </p>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EnhancedGlassCard 
            variant="premium" 
            size="lg" 
            animation="float" 
            shimmer={true}
          >
            <GlassCardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm sm:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm sm:text-base"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-400/30 rounded-xl p-3"
                  >
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <FrostedButton
                  type="submit"
                  variant="holographic"
                  size="xl"
                  glow="rainbow"
                  className="w-full font-bold"
                  loading={loading}
                  disabled={loading || !formData.email || !formData.password}
                >
                  {loading ? (
                    'Signing In...'
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </FrostedButton>

                {/* Divider */}
                <div className="relative py-4 sm:py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/60">Or continue with</span>
                  </div>
                </div>

                {/* Social Sign In */}
                <div className="space-y-3">
                  <FrostedButton
                    type="button"
                    variant="premium"
                    size="lg"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm sm:text-base">Continue with Google</span>
                  </FrostedButton>

                  <FrostedButton
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    <Shield size={18} />
                    <span className="text-sm sm:text-base">Continue with Apple</span>
                  </FrostedButton>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4 sm:pt-6 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-3">
                    Don't have an account yet?
                  </p>
                  <Link href="/auth/signup">
                    <FrostedButton variant="luxury" size="lg" className="font-semibold w-full">
                      <UserPlus size={18} />
                      Create Account
                      <Sparkles size={18} />
                    </FrostedButton>
                  </Link>
                </div>
              </form>
            </GlassCardContent>
          </EnhancedGlassCard>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <EnhancedGlassCard variant="frosted" size="default" className="text-center">
            <GlassCardContent>
              <h3 className="font-bebas text-lg sm:text-xl font-bold text-white mb-4">
                Why Choose CABANA?
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-amber-400" />
                  <p className="text-xs text-white/70">Premium Tools</p>
                </div>
                <div>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs text-white/70">Luxury Design</p>
                </div>
                <div>
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-xs text-white/70">Secure Platform</p>
                </div>
              </div>
            </GlassCardContent>
          </EnhancedGlassCard>
        </motion.div>
      </div>
    </div>
  )
}