'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, ArrowRight, Mail, User, Sparkles, Star, Zap, Heart } from 'lucide-react';
import { EnhancedGlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/ui/enhanced-glass-card';
import { FrostedButton } from '@/components/ui/frosted-button';
import { HolographicLogo } from '@/components/ui/holographic-logo';

type UserType = 'fan' | 'creator';

export default function HomePage() {
  const [userType, setUserType] = useState<UserType>('fan');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFanSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      alert('Added to waitlist! We\'ll notify you when we launch.');
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  const handleCreatorStart = () => {
    window.location.href = '/enter/setup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 relative overflow-hidden">
      {/* Ultra-Luxury Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400/15 via-purple-500/10 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-400/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl"
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

      {/* Luxury Navigation */}
      <nav className="relative z-50 p-4 sm:p-8">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <HolographicLogo size="md" animated={true} showText={true} variant="default" />
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <FrostedButton variant="ghost" size="sm">About</FrostedButton>
            <FrostedButton variant="ghost" size="sm">Creators</FrostedButton>
            <FrostedButton variant="holographic" size="sm">Join VIP</FrostedButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Ultra-Luxury Hero Header */}
          <motion.div 
            initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-20"
          >
            <motion.h1 
              className="font-bebas text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 leading-none"
              style={{
                background: "linear-gradient(90deg, #ffffff, #06b6d4, #8b5cf6, #ec4899, #ffffff)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              THE ULTIMATE
              <br />
              CREATOR EMPIRE
            </motion.h1>
            <motion.p 
              className="font-inter text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: mounted ? 0.5 : 0 }}
            >
              Where luxury meets technology. Build your empire with premium tools, 
              <br className="hidden md:block" />
              glass-morphism aesthetics, and unparalleled monetization.
            </motion.p>
          </motion.div>

          {/* Ultra-Luxury User Type Selection */}
          <motion.div 
            initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mounted ? 0.3 : 0 }}
            className="flex justify-center mb-12 sm:mb-16"
          >
            <EnhancedGlassCard 
              variant="premium" 
              size="sm" 
              animation="glow" 
              shimmer={true} 
              className="p-2 flex rounded-2xl sm:rounded-3xl border-white/20"
            >
              <FrostedButton
                variant={userType === 'fan' ? 'holographic' : 'ghost'}
                size="lg"
                glow={userType === 'fan' ? 'medium' : 'none'}
                className="px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
                onClick={() => setUserType('fan')}
              >
                <Heart size={18} />
                <span className="hidden sm:inline">I'm a Fan</span>
                <span className="sm:hidden">Fan</span>
              </FrostedButton>
              <FrostedButton
                variant={userType === 'creator' ? 'luxury' : 'ghost'}
                size="lg"
                glow={userType === 'creator' ? 'medium' : 'none'}
                className="px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-base"
                onClick={() => setUserType('creator')}
              >
                <Crown size={18} />
                <span className="hidden sm:inline">I'm a Creator</span>
                <span className="sm:hidden">Creator</span>
              </FrostedButton>
            </EnhancedGlassCard>
          </motion.div>

          {/* Content Based on User Type */}
          <AnimatePresence mode="wait">
            {userType === 'fan' ? (
              <motion.div
                key="fan"
                initial={mounted ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={mounted ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto"
              >
                <EnhancedGlassCard 
                  variant="holographic" 
                  size="lg" 
                  animation="float" 
                  shimmer={true} 
                  holographic={true}
                  className="text-center"
                >
                  <GlassCardHeader>
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles size={28} className="text-cyan-300 sm:hidden" />
                      <Sparkles size={36} className="text-cyan-300 hidden sm:block" />
                    </motion.div>
                    <GlassCardTitle className="font-bebas text-2xl sm:text-3xl mb-3 sm:mb-4">Join the VIP Waitlist</GlassCardTitle>
                    <GlassCardDescription className="text-base sm:text-lg text-white/70 px-2">
                      Be among the elite first to access exclusive creator content and premium luxury experiences.
                    </GlassCardDescription>
                  </GlassCardHeader>
                  
                  <GlassCardContent>
                    <form onSubmit={handleFanSignup} className="space-y-4 sm:space-y-6">
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
                        <input
                          type="email"
                          placeholder="Enter your VIP email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm sm:text-base"
                          required
                        />
                      </div>
                      
                      <FrostedButton
                        type="submit"
                        variant="holographic"
                        size="lg"
                        glow="rainbow"
                        loading={loading}
                        className="w-full py-3 sm:py-4 font-bold text-sm sm:text-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          "Joining VIP..."
                        ) : (
                          <>
                            <Star size={16} />
                            <span className="mx-2">Join Elite Waitlist</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </FrostedButton>
                    </form>
                  </GlassCardContent>
                </EnhancedGlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="creator"
                initial={mounted ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={mounted ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto"
              >
                <EnhancedGlassCard 
                  variant="luxury" 
                  size="lg" 
                  animation="pulse" 
                  shimmer={true}
                  className="text-center"
                >
                  <GlassCardHeader>
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-purple-300/20"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Crown size={28} className="text-amber-300 sm:hidden" />
                      <Crown size={36} className="text-amber-300 hidden sm:block" />
                    </motion.div>
                    <GlassCardTitle className="font-bebas text-2xl sm:text-3xl mb-3 sm:mb-4">Build Your Empire</GlassCardTitle>
                    <GlassCardDescription className="text-base sm:text-lg text-white/70 px-2">
                      Create your luxury digital empire with premium tools, glass aesthetics, and unlimited earning potential.
                    </GlassCardDescription>
                  </GlassCardHeader>
                  
                  <GlassCardContent>
                    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                      {[
                        { icon: <Zap size={16} className="text-purple-300" />, text: "Glass-morphism link-in-bio pages" },
                        { icon: <Star size={16} className="text-pink-300" />, text: "Premium luxury themes & animations" },
                        { icon: <Heart size={16} className="text-red-300" />, text: "Video chat, tips & VIP experiences" },
                        { icon: <Crown size={16} className="text-amber-300" />, text: "Advanced monetization & analytics" }
                      ].map((feature, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-3 sm:gap-4 text-white/80 bg-white/5 rounded-xl p-2 sm:p-3 backdrop-blur-sm border border-white/10"
                          initial={mounted ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: mounted ? 0.1 * index : 0 }}
                          whileHover={mounted ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
                        >
                          <div className="flex-shrink-0">{feature.icon}</div>
                          <span className="font-medium text-sm sm:text-base">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <FrostedButton
                      onClick={handleCreatorStart}
                      variant="luxury"
                      size="xl"
                      glow="ultra"
                      className="w-full font-bold text-sm sm:text-lg py-3 sm:py-4"
                    >
                      <Crown size={18} />
                      <span className="mx-2">Start Empire</span>
                      <ArrowRight size={18} />
                    </FrostedButton>
                  </GlassCardContent>
                </EnhancedGlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}