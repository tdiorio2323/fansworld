'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  Crown,
  Star,
  Users,
  Gift,
  Zap,
  Heart,
  Sparkles,
  Check,
  X,
  UserPlus,
  Calendar,
  Clock,
  Shield,
  Award
} from 'lucide-react'

import { EnhancedGlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

interface InviteData {
  id: string
  code: string
  creatorUsername: string
  creatorDisplayName: string
  creatorAvatarUrl: string
  creatorVerified: boolean
  type: 'vip' | 'creator' | 'exclusive' | 'beta'
  expiresAt: Date
  maxUses: number
  currentUses: number
  isValid: boolean
  benefits: {
    title: string
    description: string
    icon: React.ReactNode
    value?: string
  }[]
  exclusive?: {
    earlyAccess: boolean
    discountPercentage?: number
    bonusCredits?: number
    vipFeatures: string[]
  }
}

const inviteTypeConfig = {
  vip: {
    title: 'VIP Access Invite',
    subtitle: 'Join the Elite Circle',
    gradient: 'from-amber-500/20 via-yellow-500/15 to-orange-500/20',
    border: 'border-amber-400/30',
    icon: <Crown size={32} className="text-amber-400" />
  },
  creator: {
    title: 'Creator Beta Invite',
    subtitle: 'Build Your Empire',
    gradient: 'from-purple-500/20 via-pink-500/15 to-blue-500/20',
    border: 'border-purple-400/30',
    icon: <Star size={32} className="text-purple-400" />
  },
  exclusive: {
    title: 'Exclusive Access',
    subtitle: 'Limited Edition',
    gradient: 'from-cyan-500/20 via-blue-500/15 to-purple-500/20',
    border: 'border-cyan-400/30',
    icon: <Sparkles size={32} className="text-cyan-400" />
  },
  beta: {
    title: 'Beta Tester Invite',
    subtitle: 'Shape the Future',
    gradient: 'from-emerald-500/20 via-green-500/15 to-teal-500/20',
    border: 'border-emerald-400/30',
    icon: <Zap size={32} className="text-emerald-400" />
  }
}

export default function InviteRedemptionPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [redeemed, setRedeemed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: ''
  })

  useEffect(() => {
    const loadInvite = async () => {
      try {
        // Mock invite data - replace with actual API call
        const mockInvite: InviteData = {
          id: '1',
          code: code,
          creatorUsername: 'luxurycreator',
          creatorDisplayName: 'Luxury Creator',
          creatorAvatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=luxury`,
          creatorVerified: true,
          type: ['vip', 'creator', 'exclusive', 'beta'][Math.floor(Math.random() * 4)] as any,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          maxUses: 50,
          currentUses: Math.floor(Math.random() * 30),
          isValid: true,
          benefits: [
            {
              title: 'Early Access',
              description: 'Get access to features before everyone else',
              icon: <Clock className="w-5 h-5 text-cyan-400" />,
              value: '30 days'
            },
            {
              title: 'VIP Support',
              description: 'Priority customer support and assistance',
              icon: <Shield className="w-5 h-5 text-purple-400" />,
            },
            {
              title: 'Exclusive Content',
              description: 'Access to creator-only content and experiences',
              icon: <Award className="w-5 h-5 text-amber-400" />,
            },
            {
              title: 'Bonus Credits',
              description: 'Free credits to get started',
              icon: <Gift className="w-5 h-5 text-pink-400" />,
              value: '$25'
            }
          ],
          exclusive: {
            earlyAccess: true,
            discountPercentage: 50,
            bonusCredits: 2500,
            vipFeatures: [
              'Premium messaging',
              'Video calls',
              'Custom content requests',
              'Priority support'
            ]
          }
        }

        // Simulate API delay
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate
            setInvite(mockInvite)
          } else {
            setError('This invite code has expired or is no longer valid')
          }
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError('Failed to load invite details')
        setLoading(false)
      }
    }

    if (code) {
      loadInvite()
    }
  }, [code])

  const handleRedeem = async () => {
    if (!formData.email || !formData.username) {
      setError('Please fill in all required fields')
      return
    }

    setRedeeming(true)
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success/failure
      if (Math.random() > 0.1) {
        setRedeemed(true)
        setError(null)
      } else {
        setError('Failed to redeem invite. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while redeeming the invite')
    } finally {
      setRedeeming(false)
    }
  }

  const config = invite ? inviteTypeConfig[invite.type] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full" />
        </motion.div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center p-6">
        <EnhancedGlassCard variant="obsidian" size="lg" className="text-center max-w-md">
          <GlassCardContent>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Invalid Invite</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <FrostedButton
              variant="ghost"
              onClick={() => router.push('/')}
            >
              Return Home
            </FrostedButton>
          </GlassCardContent>
        </EnhancedGlassCard>
      </div>
    )
  }

  if (redeemed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <EnhancedGlassCard 
            variant="holographic" 
            size="lg" 
            shimmer={true} 
            holographic={true}
            className="text-center max-w-lg"
          >
            <GlassCardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-emerald-400" />
              </motion.div>
              
              <h2 className="font-bebas text-3xl font-bold text-white mb-4">
                Welcome to CABANA!
              </h2>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                Your invite has been successfully redeemed. You now have access to all the exclusive benefits!
              </p>
              
              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-white mb-3">Your Benefits Include:</h3>
                <div className="space-y-2 text-left">
                  {invite?.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/80">
                      <div className="flex-shrink-0">{benefit.icon}</div>
                      <span className="text-sm">{benefit.title}</span>
                      {benefit.value && (
                        <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full">
                          {benefit.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <FrostedButton
                  variant="holographic"
                  size="lg"
                  className="flex-1 font-bold"
                  onClick={() => router.push('/enter/setup')}
                >
                  <UserPlus size={18} />
                  Complete Setup
                </FrostedButton>
                <FrostedButton
                  variant="premium"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push('/explore')}
                >
                  Explore Platform
                </FrostedButton>
              </div>
            </GlassCardContent>
          </EnhancedGlassCard>
        </motion.div>
      </div>
    )
  }

  if (!invite || !config) return null

  const isExpired = new Date() > invite.expiresAt
  const isMaxedOut = invite.currentUses >= invite.maxUses
  const canRedeem = invite.isValid && !isExpired && !isMaxedOut

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      {/* Navigation */}
      <nav className="p-6">
        <div className="flex justify-center">
          <HolographicLogo size="md" animated={true} showText={true} variant="default" />
        </div>
      </nav>

      <div className="px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Invite Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-bebas text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">
              {config.title}
            </h1>
            <p className="text-white/60 text-lg">{config.subtitle}</p>
          </motion.div>

          {/* Main Invite Card */}
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
              className={`mb-8 bg-gradient-to-br ${config.gradient} border ${config.border}`}
            >
              <GlassCardHeader>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    {config.icon}
                  </div>
                  
                  <GlassCardTitle className="mb-2">
                    You have been invited by
                  </GlassCardTitle>
                  
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img
                      src={invite.creatorAvatarUrl}
                      alt={invite.creatorDisplayName}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{invite.creatorDisplayName}</span>
                        {invite.creatorVerified && (
                          <Crown className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-white/60 text-sm">@{invite.creatorUsername}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 inline-block">
                    <code className="font-mono text-cyan-300 font-bold text-lg tracking-wider">
                      {invite.code}
                    </code>
                  </div>
                </div>
              </GlassCardHeader>

              <GlassCardContent>
                {/* Status */}
                <div className="text-center mb-6">
                  {canRedeem ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Valid Invite</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <X className="w-5 h-5" />
                      <span className="font-medium">
                        {isExpired ? 'Expired' : 'No longer available'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Invite Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-white/60" />
                    <p className="text-xs text-white/60">Expires</p>
                    <p className="font-semibold text-white">
                      {invite.expiresAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-white/60" />
                    <p className="text-xs text-white/60">Remaining</p>
                    <p className="font-semibold text-white">
                      {invite.maxUses - invite.currentUses} / {invite.maxUses}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-white text-center">Exclusive Benefits</h3>
                  {invite.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex-shrink-0">{benefit.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{benefit.title}</p>
                        <p className="text-white/60 text-xs">{benefit.description}</p>
                      </div>
                      {benefit.value && (
                        <div className="bg-white/10 px-2 py-1 rounded-lg">
                          <span className="text-xs font-bold text-white">{benefit.value}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Redeem Form */}
                {canRedeem && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-center mb-4">Claim Your Access</h3>
                    
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        required
                      />
                      
                      <input
                        type="text"
                        placeholder="Choose username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        required
                      />
                      
                      <input
                        type="text"
                        placeholder="Display name (optional)"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 text-center">
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    )}

                    <FrostedButton
                      variant="holographic"
                      size="xl"
                      glow="rainbow"
                      className="w-full font-bold"
                      onClick={handleRedeem}
                      loading={redeeming}
                      disabled={redeeming || !formData.email || !formData.username}
                    >
                      {redeeming ? (
                        'Claiming Access...'
                      ) : (
                        <>
                          <Star size={20} />
                          Claim Exclusive Access
                          <Sparkles size={20} />
                        </>
                      )}
                    </FrostedButton>
                  </div>
                )}

                {!canRedeem && (
                  <div className="text-center">
                    <p className="text-white/60 mb-4">
                      This invite is no longer valid or has expired.
                    </p>
                    <FrostedButton
                      variant="ghost"
                      onClick={() => router.push('/')}
                    >
                      Return Home
                    </FrostedButton>
                  </div>
                )}
              </GlassCardContent>
            </EnhancedGlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}