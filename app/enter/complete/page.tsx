'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Settings,
  Share2,
  BarChart3,
  DollarSign,
  Users,
  Link as LinkIcon,
  Video,
  MessageSquare,
  Calendar,
  Music,
  ShoppingBag,
  Mail,
  Instagram,
  Sparkles,
  Rocket
} from 'lucide-react';

// Mock data for demonstration
const mockProfile = {
  name: 'Sarah Rose',
  username: 'sarahrose',
  profileImage: '/placeholder-profile.jpg', // You'd use uploaded image
  theme: 'noir',
  bio: 'Content creator & lifestyle influencer ✨',
  features: [
    { type: 'video_chat', title: '1-on-1 Video Chat', price: '$10/min', enabled: true },
    { type: 'tip_jar', title: 'Send a Tip', subtitle: 'Support my content', enabled: true },
    { type: 'link', title: 'My Latest Vlog', url: 'https://youtube.com/@sarah', enabled: true },
    { type: 'booking', title: 'Book a Session', price: '$100/hr', enabled: true },
    { type: 'social', title: 'Follow on Instagram', url: 'https://instagram.com/sarahrose', enabled: true }
  ]
};

const featureIcons = {
  video_chat: Video,
  tip_jar: DollarSign,
  link: LinkIcon,
  booking: Calendar,
  social: Instagram,
  music: Music,
  store: ShoppingBag,
  email: Mail
};

const featureColors = {
  video_chat: 'from-purple-500 to-pink-500',
  tip_jar: 'from-green-500 to-emerald-500',
  link: 'from-blue-500 to-cyan-500',
  booking: 'from-orange-500 to-red-500',
  social: 'from-yellow-500 to-orange-500',
  music: 'from-pink-500 to-rose-500',
  store: 'from-violet-500 to-purple-500',
  email: 'from-teal-500 to-cyan-500'
};

export default function CompletePage() {
  const [copied, setCopied] = useState(false);
  const [isLive, setIsLive] = useState(false);
  
  const profileUrl = `https://cabana.link/${mockProfile.username}`;

  useEffect(() => {
    // Simulate going live after 2 seconds
    const timer = setTimeout(() => {
      setIsLive(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mockProfile.name} - Cabana Creator`,
        text: `Check out my creator page on Cabana!`,
        url: profileUrl,
      });
    } else {
      copyUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-gradient-gold tracking-tight">
            CABANA
          </h1>
          
          {isLive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 glass-card px-4 py-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">LIVE</span>
            </motion.div>
          )}
        </div>
      </nav>

      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              {isLive ? (
                <Rocket size={48} className="text-green-400" />
              ) : (
                <div className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
              )}
            </div>
            
            <h1 className="text-display mb-4">
              {isLive ? (
                <>
                  Your Page is
                  <span className="text-gradient-gold ml-4">LIVE!</span>
                </>
              ) : (
                <>
                  Creating Your
                  <span className="text-gradient-gold ml-4">Creator Page</span>
                </>
              )}
            </h1>
            
            <p className="text-subtitle text-gray-300 max-w-2xl mx-auto">
              {isLive ? (
                'Congratulations! Your creator page is now live and ready to start earning.'
              ) : (
                'Setting up your profile, features, and monetization tools...'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Creator Page Preview */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-title text-white">Your Creator Page</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyUrl}
                      className={`glass-button text-sm ${copied ? 'bg-green-500/20' : ''}`}
                    >
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="glass-button text-sm"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>

                {/* Mobile Preview Frame */}
                <div className="relative max-w-sm mx-auto">
                  <div className="bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                    <div className="bg-gradient-to-br from-gray-800 to-black rounded-[2rem] p-6 min-h-[600px]">
                      
                      {/* Profile Header */}
                      <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Crown size={32} className="text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">@{mockProfile.username}</h3>
                        <p className="text-gray-300 text-sm">{mockProfile.bio}</p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {mockProfile.features.filter(f => f.enabled).map((feature, index) => {
                          const IconComponent = featureIcons[feature.type as keyof typeof featureIcons];
                          const colorClass = featureColors[feature.type as keyof typeof featureColors];
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className={`w-full p-4 rounded-xl bg-gradient-to-r ${colorClass} text-white font-medium text-center cursor-pointer hover:scale-105 transition-transform`}
                            >
                              <div className="flex items-center justify-center gap-3">
                                <IconComponent size={20} />
                                <span>{feature.title}</span>
                                {feature.price && (
                                  <span className="text-sm opacity-80">({feature.price})</span>
                                )}
                              </div>
                              {feature.subtitle && (
                                <p className="text-sm opacity-80 mt-1">{feature.subtitle}</p>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* URL Display */}
                      <div className="mt-8 text-center">
                        <div className="glass-card p-3 inline-block">
                          <p className="text-gray-300 text-sm">
                            {profileUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats & Actions Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      <span className="text-gray-300">Visitors</span>
                    </div>
                    <span className="text-white font-semibold">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-400" />
                      <span className="text-gray-300">Earnings</span>
                    </div>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-purple-400" />
                      <span className="text-gray-300">Conversion</span>
                    </div>
                    <span className="text-white font-semibold">0%</span>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <button className="w-full glass-button-primary text-left">
                    <Settings size={16} />
                    Customize Your Page
                  </button>
                  
                  <button className="w-full glass-button text-left">
                    <Share2 size={16} />
                    Share Your Link
                  </button>
                  
                  <button className="w-full glass-button text-left">
                    <BarChart3 size={16} />
                    View Analytics
                  </button>
                  
                  <button className="w-full glass-button text-left">
                    <MessageSquare size={16} />
                    Connect Social Media
                  </button>
                </div>
              </motion.div>

              {/* Success Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>• Share your link on all social platforms</p>
                  <p>• Update your bio regularly with fresh content</p>
                  <p>• Engage with fans through video chat</p>
                  <p>• Use tip jar for special content</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-16"
          >
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="text-title text-white mb-4">Ready to Start Earning?</h3>
              <p className="text-gray-300 mb-8">
                Your creator page is live! Share your link and start connecting with your audience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={copyUrl}
                  className="glass-button-primary text-lg px-8 py-4"
                >
                  <Copy size={20} />
                  Copy Your Link
                </button>
                
                <button
                  onClick={() => window.open(profileUrl, '_blank')}
                  className="glass-button text-lg px-8 py-4"
                >
                  <ExternalLink size={20} />
                  View Live Page
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}