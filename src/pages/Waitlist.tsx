import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, Mail, Sparkles, Star, Users, Timer, 
  CheckCircle, ArrowRight, Diamond, Gem, Shield,
  Zap, TrendingUp, Gift, Calendar, Flame
} from 'lucide-react'

const Waitlist = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState('vip')

  const waitlistTiers = [
    {
      id: 'early',
      name: 'Early Access',
      icon: Users,
      color: 'from-blue-500 to-purple-500',
      benefits: ['First 1000 users', 'Free premium features', 'Exclusive onboarding'],
      spots: 847
    },
    {
      id: 'vip',
      name: 'VIP Launch',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      benefits: ['VIP status guaranteed', 'Personal onboarding', 'Lifetime discounts'],
      spots: 243,
      popular: true
    },
    {
      id: 'founder',
      name: 'Founder Circle',
      icon: Diamond,
      color: 'from-yellow-400 to-orange-500',
      benefits: ['Founder badge', 'Product input', 'Revenue sharing'],
      spots: 47
    }
  ]

  const stats = [
    { label: 'Creators Waiting', value: '12,847', icon: Users },
    { label: 'Countries Interested', value: '89', icon: Star },
    { label: 'VIP Spots Remaining', value: '243', icon: Crown },
    { label: 'Launch Countdown', value: '47 days', icon: Timer }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glass-card-premium p-12 rounded-3xl mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 vip-glow rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            >
              Welcome to the Future! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed text-luxury"
            >
              You're officially on the CABANA {waitlistTiers.find(t => t.id === selectedTier)?.name} waitlist! 
              Get ready for the ultimate creator platform experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              <div className="content-card p-4 rounded-xl text-center">
                <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="font-semibold text-luxury">Exclusive Access</div>
                <div className="text-sm text-gray-400">You'll be among the first to experience CABANA</div>
              </div>
              <div className="content-card p-4 rounded-xl text-center">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="font-semibold text-luxury">Launch Updates</div>
                <div className="text-sm text-gray-400">Get weekly progress updates and sneak peeks</div>
              </div>
              <div className="content-card p-4 rounded-xl text-center">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="font-semibold text-luxury">VIP Perks</div>
                <div className="text-sm text-gray-400">Exclusive features and lifetime benefits</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="luxury-button px-8 py-3 rounded-full font-semibold flex items-center gap-2 interactive-scale">
                <Crown className="w-5 h-5" />
                Share with Friends
              </button>
              <button className="glass-card px-8 py-3 rounded-full font-semibold border border-white/20 hover:border-purple-500/50 transition-all interactive-scale">
                Follow Updates
              </button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 text-sm"
          >
            Expected launch: Spring 2025 • Position #{Math.floor(Math.random() * 1000) + 100} in queue
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl float-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 glass-card-premium rounded-full flex items-center justify-center pulse-glow">
              <Diamond className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">CABANA</h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 text-luxury">
            The Future of Creator Economy
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators building the next generation of premium content experiences. 
            Be among the first to access our revolutionary platform.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card p-6 rounded-2xl text-center interactive-scale"
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-luxury mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-card-premium p-8 rounded-3xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Join the Waitlist
                </h2>
                <p className="text-gray-300 text-luxury">
                  Secure your spot and get exclusive early access to CABANA
                </p>
              </div>

              {/* Tier Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-luxury">Choose Your Access Level</h3>
                <div className="space-y-4">
                  {waitlistTiers.map((tier) => (
                    <motion.button
                      key={tier.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                        selectedTier === tier.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shimmer">
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center flex-shrink-0`}>
                          <tier.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-luxury">{tier.name}</h4>
                            <div className="text-sm text-gray-400">
                              {tier.spots} spots left
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                            {tier.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full luxury-button py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 interactive-scale shimmer"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></div>
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Join the Waitlist
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                <Shield className="w-4 h-4 inline mr-1" />
                Your email is secure and will never be shared. Unsubscribe anytime.
              </div>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold gradient-text mb-4">
                What's Coming
              </h3>
              <p className="text-gray-300 text-luxury">
                Revolutionary features that will transform how creators build and monetize
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Crown,
                  title: 'VIP Communities',
                  description: 'Create exclusive tiers with premium access and content',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Zap,
                  title: 'AI Content Tools',
                  description: 'Generate, optimize and schedule content with AI assistance',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: TrendingUp,
                  title: 'Advanced Analytics',
                  description: 'Deep insights into audience behavior and revenue optimization',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Gem,
                  title: 'Multi-Platform Sync',
                  description: 'Seamlessly manage content across all social platforms',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: Flame,
                  title: 'Revenue Sharing',
                  description: 'Innovative monetization with creator-first economics',
                  color: 'from-red-500 to-pink-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="content-card p-6 rounded-xl hover:scale-105 transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-luxury mb-2">{feature.title}</h4>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
              Ready to Build the Future?
            </h3>
            <p className="text-gray-300 text-lg mb-6 text-luxury">
              Join the most exclusive creator platform launching in 2025. 
              Limited spots available.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Launch: Spring 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>12,847+ Creators Waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Invitation Only</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Waitlist 