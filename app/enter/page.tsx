'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, ArrowRight, Mail, User, Sparkles } from 'lucide-react';

type UserType = 'fan' | 'creator';

export default function EnterPage() {
  const [userType, setUserType] = useState<UserType>('fan');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFanSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Add to waitlist
    setTimeout(() => {
      alert('Added to waitlist! We\'ll notify you when we launch.');
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  const handleCreatorStart = () => {
    // Navigate to creator setup
    window.location.href = '/enter/setup';
  };

  return (
    <div className="min-h-screen bg-gradient-noir relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-gradient-gold tracking-tight">
            CABANA
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-display mb-6 leading-none">
              Welcome to
              <br />
              <span className="text-gradient-gold">CABANA</span>
            </h1>
            <p className="text-subtitle text-gray-300 max-w-2xl mx-auto mb-12">
              The premium creator platform with advanced monetization tools and luxury subscriber experiences.
            </p>
          </motion.div>

          {/* User Type Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="glass-card p-2 flex rounded-2xl">
              <button
                onClick={() => setUserType('fan')}
                className={`px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  userType === 'fan' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users size={20} />
                I'm a Fan
              </button>
              <button
                onClick={() => setUserType('creator')}
                className={`px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  userType === 'creator' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg font-bold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Crown size={20} />
                I'm a Creator
              </button>
            </div>
          </motion.div>

          {/* Content Based on User Type */}
          <AnimatePresence mode="wait">
            {userType === 'fan' ? (
              <motion.div
                key="fan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-md mx-auto"
              >
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} className="text-purple-400" />
                  </div>
                  
                  <h2 className="text-title text-white mb-4">Join the Waitlist</h2>
                  <p className="text-gray-300 mb-8">
                    Be the first to access exclusive creator content and premium experiences.
                  </p>
                  
                  <form onSubmit={handleFanSignup} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full glass-button-primary"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="creator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Crown size={32} className="text-yellow-400" />
                  </div>
                  
                  <h2 className="text-title text-white mb-4">Build Your Empire</h2>
                  <p className="text-gray-300 mb-8">
                    Create your custom link-in-bio page with premium features and start monetizing your content.
                  </p>
                  
                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Custom link-in-bio page
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Multiple style themes
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Video chat & tip jar
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Advanced monetization
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCreatorStart}
                    className="w-full glass-button-primary text-lg py-4"
                  >
                    <User size={20} />
                    Start Building
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-24 text-center"
          >
            <div className="glass-card p-8">
              <h3 className="text-title text-white mb-6">Why Choose Cabana?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Crown size={24} className="text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Premium Tools</h4>
                  <p className="text-gray-400 text-sm">Advanced monetization beyond traditional platforms</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Custom Pages</h4>
                  <p className="text-gray-400 text-sm">Build stunning link-in-bio pages with style</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Fan Engagement</h4>
                  <p className="text-gray-400 text-sm">Direct video chat and premium features</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}