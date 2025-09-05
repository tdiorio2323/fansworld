'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Zap, 
  Diamond,
  Lock,
  Unlock,
  ChevronDown
} from 'lucide-react';

type Theme = 'noir' | 'desert' | 'neon';

export default function HomePage() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('noir');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const themeConfig = {
    noir: {
      name: 'Noir',
      icon: Crown,
      gradient: 'text-gradient-gold',
      description: 'Sophisticated elegance with gold accents',
    },
    desert: {
      name: 'Desert',
      icon: Sparkles,
      gradient: 'text-gradient-desert',
      description: 'Warm luxury with bronze tones',
    },
    neon: {
      name: 'Neon',
      icon: Zap,
      gradient: 'text-gradient-neon',
      description: 'Electric luxury with cyber aesthetics',
    },
  };

  const features = [
    {
      icon: Crown,
      title: 'Premium Creator Tools',
      description: 'Advanced monetization beyond traditional platforms with sophisticated analytics.',
    },
    {
      icon: Diamond,
      title: 'Exclusive Content Hub',
      description: 'Luxury-grade content management with premium subscriber experiences.',
    },
    {
      icon: Lock,
      title: 'VIP Member Access',
      description: 'Elite tier memberships with personalized engagement opportunities.',
    },
    {
      icon: Star,
      title: 'Enterprise Analytics',
      description: 'Real-time insights and advanced metrics for serious creators.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-noir overflow-hidden relative">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-2xl font-black text-gradient-gold tracking-tight">
              CABANA
            </h1>
          </motion.div>

          {/* Theme Switcher */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="theme-switcher"
          >
            {Object.entries(themeConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key as Theme)}
                  className={`theme-button ${currentTheme === key ? 'active' : ''}`}
                  title={config.description}
                >
                  <IconComponent size={16} />
                  <span className="ml-1">{config.name}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 px-8"
      >
        <div className="max-w-7xl mx-auto pt-16 pb-24">
          {/* Hero Content */}
          <div className="text-center mb-24">
            <motion.div variants={itemVariants} className="mb-8">
              <span className="text-caption text-gray-400 uppercase tracking-widest">
                The Ultimate Creator Empire
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-display mb-8 leading-none"
            >
              Beyond
              <br />
              <span className={themeConfig[currentTheme].gradient}>
                OnlyFans
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-subtitle text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Premium creator platform with advanced monetization tools, 
              exclusive content management, and luxury subscriber experiences 
              that elevate your brand to new heights.
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <a 
                href="/enter" 
                className="glass-button-primary group"
              >
                <Crown size={20} />
                Start Your Empire
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="/vip" 
                className="glass-button group"
              >
                <Lock size={20} />
                VIP Access
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Feature Cards Grid */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card p-8 group cursor-pointer animate-float"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={28} className="text-yellow-400" />
                    </div>
                    <h3 className="text-title mb-3 text-white group-hover:text-yellow-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-body text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-yellow-400 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="mb-24">
            <div className="glass-card p-12 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="group">
                  <div className="text-headline text-gradient-gold mb-2">
                    $2.4M+
                  </div>
                  <div className="text-caption text-gray-400 uppercase tracking-wider">
                    Creator Earnings
                  </div>
                </div>
                <div className="group">
                  <div className="text-headline text-gradient-gold mb-2">
                    50K+
                  </div>
                  <div className="text-caption text-gray-400 uppercase tracking-wider">
                    Premium Members
                  </div>
                </div>
                <div className="group">
                  <div className="text-headline text-gradient-gold mb-2">
                    99.9%
                  </div>
                  <div className="text-caption text-gray-400 uppercase tracking-wider">
                    Uptime Guarantee
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="glass-card p-16 ambient-glow">
              <h2 className="text-title mb-6 text-white">
                Ready to Build Your 
                <span className={`ml-3 ${themeConfig[currentTheme].gradient}`}>
                  Creator Empire?
                </span>
              </h2>
              
              <p className="text-body text-gray-300 mb-12 max-w-2xl mx-auto">
                Join the exclusive platform where premium creators earn more, 
                engage deeper, and build lasting wealth through sophisticated 
                monetization tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="/enter" 
                  className="glass-button-primary group text-lg px-12 py-4"
                >
                  <Unlock size={24} />
                  Get Started Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm mb-2 uppercase tracking-wider">Scroll</span>
            <ChevronDown size={20} className="animate-bounce" />
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}