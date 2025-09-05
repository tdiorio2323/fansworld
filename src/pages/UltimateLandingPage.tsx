import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Crown, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Play, 
  MessageCircle, 
  Star, 
  Lock, 
  DollarSign,
  Heart,
  Share2,
  BarChart3,
  Sparkles,
  Eye,
  Rocket,
  Globe,
  Bot,
  CreditCard,
  Gift,
  ShoppingBag,
  Coins,
  Palette,
  Code,
  Settings,
  CheckCircle,
  ArrowRight,
  Mail,
  User,
  Smartphone,
  Monitor,
  Tablet,
  Diamond
} from 'lucide-react'

const UltimateLandingPage = () => {
  const [fanEmail, setFanEmail] = useState('')
  const [creatorEmail, setCreatorEmail] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const navigate = useNavigate()

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const springConfig = { damping: 25, stiffness: 100 }
  const ySpring = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleFanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fanEmail.trim()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitMessage('Welcome to the exclusive waitlist! 🎉')
    setFanEmail('')
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creatorEmail.trim() || !creatorName.trim()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitMessage('Your application has been received! We\'ll be in touch soon. ⭐')
    setCreatorEmail('')
    setCreatorName('')
  }

  const premiumFeatures = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Advanced Monetization Suite",
      description: "Multi-tier subscriptions, pay-per-view content, custom pricing tiers, and tip multipliers",
      gradient: "from-emerald-400 to-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sophisticated Fan Engagement",
      description: "Interactive polls, custom reactions, fan badges, loyalty rewards, and gamified experiences",
      gradient: "from-blue-400 to-purple-600"
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Ultra-HD Content Delivery",
      description: "4K/8K streaming, adaptive quality, instant loading, and global CDN with 99.9% uptime",
      gradient: "from-pink-400 to-red-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Real-time insights, predictive revenue modeling, fan behavior analysis, and optimization suggestions",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Smart Recommendation Engine",
      description: "AI-driven content discovery, personalized feeds, trending predictions, and cross-platform promotion",
      gradient: "from-violet-400 to-indigo-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "End-to-end encryption, content protection, identity verification, and anti-piracy systems",
      gradient: "from-orange-400 to-red-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Next-Gen Messaging",
      description: "Voice messages, video calls, custom stickers, message scheduling, and bulk messaging tools",
      gradient: "from-teal-400 to-cyan-600"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Fan Loyalty Programs",
      description: "VIP tiers, exclusive rewards, milestone celebrations, and personalized fan experiences",
      gradient: "from-amber-400 to-orange-600"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Social Commerce Integration",
      description: "Product showcases, affiliate marketing, brand partnerships, and merchandise stores",
      gradient: "from-rose-400 to-pink-600"
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "NFT & Blockchain Support",
      description: "Mint exclusive NFTs, crypto payments, blockchain verification, and digital collectibles",
      gradient: "from-yellow-400 to-amber-600"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Custom Branding Suite",
      description: "Personalized themes, custom domains, branded apps, and white-label solutions",
      gradient: "from-indigo-400 to-purple-600"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Developer API Access",
      description: "RESTful APIs, webhooks, third-party integrations, and custom app development tools",
      gradient: "from-gray-400 to-slate-600"
    }
  ]

  const stats = [
    { number: "10M+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "$500M+", label: "Creator Earnings", icon: <DollarSign className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "150+", label: "Countries", icon: <Globe className="w-6 h-6" /> }
  ]

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A0B14 0%, #1A0B2E 20%, #C77DFF 40%, #FF006E 60%, #B400FF 80%, #0A0B14 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(199, 125, 255, 0.4) 0%, transparent 70%)',
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-15 right-0 top-1/4"
          style={{
            background: 'radial-gradient(circle, rgba(255, 0, 110, 0.4) 0%, transparent 70%)',
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 80 }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center px-4 relative z-10"
        style={{ y: ySpring, opacity, scale }}
      >
        <div className="max-w-6xl w-full">
          <motion.div 
            className="backdrop-blur-3xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Premium Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            {/* Logo Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="w-16 h-16 border-4 border-white rotate-45 rounded-lg mr-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600 opacity-80" />
                    <div className="absolute inset-2 border-2 border-white/50 rounded-sm" />
                  </div>
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-light italic text-white">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Cabana
                  </span>
                </h1>
              </div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  The Future of Creator Economy
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Revolutionizing the adult content industry with cutting-edge technology, 
                military-grade security, and unprecedented creator monetization tools that 
                leave OnlyFans and Pornhub in the dust.
              </motion.p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-center mb-2 text-purple-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                onClick={() => document.getElementById('fan-waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-chrome px-8 py-4 text-lg font-semibold flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-6 h-6" />
                Join Fan Waitlist
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('creator-access')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-luxury px-8 py-4 text-lg font-semibold flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="w-6 h-6" />
                Creator Early Access
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Showcase */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Industry-Leading Features
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover why top creators are switching to Cabana's revolutionary platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-glass p-8 h-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 flex items-center justify-center text-white shadow-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Waitlist Section */}
      <section id="fan-waitlist" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="card-luxury p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-gradient-luxury">
                Join the Exclusive Fan Waitlist
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Be among the first fans to experience the future of premium content. 
              Get VIP access, exclusive perks, and special launch pricing.
            </p>

            <form onSubmit={handleFanSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  value={fanEmail}
                  onChange={(e) => setFanEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-lg"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury px-8 py-4 whitespace-nowrap flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Join Waitlist
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {submitMessage && (
              <motion.div
                className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl text-green-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {submitMessage}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Creator Early Access Section */}
      <section id="creator-access" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="card-chrome-luxury p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 p-1">
                <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Creator Early Access Program
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Apply for exclusive early access to Cabana's creator platform. 
              Limited spots available for established creators ready to dominate.
            </p>

            <form onSubmit={handleCreatorSubmit} className="max-w-lg mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Creator Name"
                  className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-lg"
                  required
                />
                <input
                  type="email"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  placeholder="Email Address"
                  className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-lg"
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-chrome-mirror px-8 py-4 text-lg font-bold flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-gray-600/30 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Apply for Early Access
                    <Diamond className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>

            {submitMessage && (
              <motion.div
                className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl text-green-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {submitMessage}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Seamless Experience Across All Devices
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Smartphone className="w-12 h-12" />, title: "Mobile App", desc: "iOS & Android native apps" },
              { icon: <Monitor className="w-12 h-12" />, title: "Desktop", desc: "Optimized web experience" },
              { icon: <Tablet className="w-12 h-12" />, title: "Tablet", desc: "Touch-optimized interface" }
            ].map((device, index) => (
              <motion.div
                key={device.title}
                className="card-glass p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="text-purple-400 mb-4 flex justify-center">
                  {device.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{device.title}</h3>
                <p className="text-white/70">{device.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 border-2 border-white rotate-45 rounded-sm mr-3"></div>
            <span className="text-2xl font-light italic text-white">Cabana</span>
          </div>
          
          <p className="text-white/60 mb-6">
            The future of creator economy starts here
          </p>
          
          <div className="flex justify-center space-x-8 mb-8">
            <button 
              onClick={() => navigate('/discover')} 
              className="text-white/70 hover:text-white transition-colors"
            >
              Platform Preview
            </button>
            <button 
              onClick={() => navigate('/about-us')} 
              className="text-white/70 hover:text-white transition-colors"
            >
              About Us
            </button>
          </div>
          
          <p className="text-white/40 text-sm">
            Powered by TD Studios • © 2024 Cabana Group
          </p>
        </div>
      </footer>
    </div>
  )
}

export default UltimateLandingPage