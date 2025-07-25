import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Crown, 
  Star, 
  ArrowRight, 
  Mail, 
  CheckCircle,
  Gem,
  Users,
  Shield,
  Zap
} from 'lucide-react'

export function ComingSoon() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    
    try {
      // Simplified waitlist submission - just store in localStorage for now
      const waitlistData = JSON.parse(localStorage.getItem('cabana_waitlist') || '[]')
      waitlistData.push({
        email,
        timestamp: new Date().toISOString(),
        source: 'coming_soon_page'
      })
      localStorage.setItem('cabana_waitlist', JSON.stringify(waitlistData))
      
      setIsSubmitted(true)
      setEmail('')
    } catch (error) {
      console.error('Waitlist submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
          url('/holographic-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="holographic-card p-6 rounded-full">
              <Crown className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome to <span className="prismatic-text">CABANA</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The ultimate luxury platform for creators and their exclusive communities. 
            Get ready for premium content, VIP experiences, and unparalleled creator tools.
          </motion.p>

          {/* Coming Soon Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-3 mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Sparkles className="w-5 h-5 text-purple-300" />
            <span className="text-purple-200 font-medium">Coming Soon</span>
          </motion.div>

          {/* Features Preview */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="glass-card p-6 rounded-2xl backdrop-blur-xl">
              <Gem className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-2">Premium Content</h3>
              <p className="text-gray-300 text-sm">Exclusive creator content with luxury presentation</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl backdrop-blur-xl">
              <Users className="w-12 h-12 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-2">VIP Communities</h3>
              <p className="text-gray-300 text-sm">Elite membership tiers and exclusive access</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl backdrop-blur-xl">
              <Shield className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-2">Enterprise Security</h3>
              <p className="text-gray-300 text-sm">Bank-level security for creators and fans</p>
            </div>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="relative flex-1 w-full">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !email}
                    className="luxury-button px-8 py-3 rounded-full text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="glass-card p-8 rounded-2xl backdrop-blur-xl max-w-md mx-auto">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">You're In!</h3>
                    <p className="text-gray-300 mb-4">
                      Welcome to the CABANA waitlist. You'll be among the first to experience luxury creator content.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                      <Star className="w-4 h-4" />
                      <span>VIP Early Access Guaranteed</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>1M+ Creators Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Premium Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span>Launching Soon</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}