
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Video, 
  DollarSign, 
  Link as LinkIcon, 
  Calendar,
  Music,
  ShoppingBag,
  Mail,
  Instagram,
  ExternalLink,
  Gift
} from 'lucide-react';

// Mock creator data (in real app, this would come from database based on username)
const getCreatorData = (username: string) => ({
  name: username === 'sarahrose' ? 'Sarah Rose' : 'Creator Name',
  username,
  bio: username === 'sarahrose' ? 'Content creator & lifestyle influencer ✨' : 'Welcome to my creator page!',
  profileImage: null,
  theme: 'noir',
  isVerified: true,
  features: [
    { 
      id: '1',
      type: 'video_chat', 
      title: '1-on-1 Video Chat', 
      subtitle: 'Private video session',
      price: 10, 
      enabled: true,
      icon: Video,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: '2',
      type: 'tip_jar', 
      title: 'Send a Tip', 
      subtitle: 'Support my content',
      enabled: true,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: '3',
      type: 'link', 
      title: 'My Latest Vlog', 
      subtitle: 'Check out my YouTube',
      url: 'https://youtube.com',
      enabled: true,
      icon: LinkIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: '4',
      type: 'booking', 
      title: 'Book a Session', 
      subtitle: 'Personal coaching available',
      price: 100, 
      enabled: true,
      icon: Calendar,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: '5',
      type: 'social', 
      title: 'Follow on Instagram', 
      url: 'https://instagram.com',
      enabled: true,
      icon: Instagram,
      color: 'from-yellow-500 to-orange-500'
    }
  ]
});

interface CreatorPageProps {
  params: {
    username: string;
  };
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const [creator, setCreator] = useState(getCreatorData(params.username));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading creator data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFeatureClick = (feature: any) => {
    switch (feature.type) {
      case 'video_chat':
        alert(`Starting video chat with ${creator.name}! Price: $${feature.price}/min`);
        break;
      case 'tip_jar':
        alert(`Opening tip jar for ${creator.name}! Send a tip to support their content.`);
        break;
      case 'link':
        if (feature.url) {
          window.open(feature.url, '_blank');
        }
        break;
      case 'booking':
        alert(`Booking session with ${creator.name}! Price: $${feature.price}/hour`);
        break;
      case 'social':
        if (feature.url) {
          window.open(feature.url, '_blank');
        }
        break;
      default:
        alert(`Feature: ${feature.title}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-noir flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading creator page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <h1 className="text-xl font-black text-gradient-gold tracking-tight">
            CABANA
          </h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Gift size={16} />
            <span className="text-sm">Creator Page</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-md mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            
            {/* Profile Header */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Crown size={32} className="text-yellow-400" />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">@{creator.username}</h1>
                {creator.isVerified && (
                  <Crown size={20} className="text-yellow-400" />
                )}
              </div>
              
              <p className="text-gray-300">{creator.bio}</p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {creator.features.filter(f => f.enabled).map((feature, index) => {
                const IconComponent = feature.icon;
                
                return (
                  <motion.button
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={() => handleFeatureClick(feature)}
                    className={`w-full p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white font-medium text-center hover:scale-105 transition-transform shadow-lg`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <IconComponent size={20} />
                      <span>{feature.title}</span>
                      {feature.price && (
                        <span className="text-sm opacity-80">
                          (${feature.price}{feature.type === 'video_chat' ? '/min' : feature.type === 'booking' ? '/hr' : ''})
                        </span>
                      )}
                      {feature.url && (
                        <ExternalLink size={16} className="opacity-80" />
                      )}
                    </div>
                    {feature.subtitle && (
                      <p className="text-sm opacity-80 mt-1">{feature.subtitle}</p>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-gray-700"
            >
              <p className="text-gray-400 text-sm mb-4">
                Powered by <span className="text-yellow-400 font-semibold">CABANA</span>
              </p>
              
              <button
                onClick={() => window.location.href = '/enter'}
                className="glass-button text-sm"
              >
                Create Your Own Page
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
