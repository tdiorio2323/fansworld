import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Wand2, Zap, Brain, TrendingUp, Calendar, 
  Camera, Video, Mic, FileText, Star, Crown, Diamond,
  ChevronRight, Clock, Target, BarChart3, Lightbulb
} from 'lucide-react'

const AIContentCreator = () => {
  const [selectedContentType, setSelectedContentType] = useState('post')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])

  const contentTypes = [
    { id: 'post', label: 'Social Post', icon: FileText, color: 'from-blue-500 to-purple-500' },
    { id: 'video', label: 'Video Script', icon: Video, color: 'from-red-500 to-pink-500' },
    { id: 'photo', label: 'Photo Caption', icon: Camera, color: 'from-green-500 to-teal-500' },
    { id: 'audio', label: 'Podcast Script', icon: Mic, color: 'from-yellow-500 to-orange-500' },
  ]

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Smart Content Analysis',
      description: 'AI analyzes your best-performing content to suggest improvements',
      premium: false
    },
    {
      icon: TrendingUp,
      title: 'Trend Prediction',
      description: 'Predict viral content trends before they happen',
      premium: true
    },
    {
      icon: Calendar,
      title: 'Optimal Timing',
      description: 'AI suggests the best times to post for maximum engagement',
      premium: false
    },
    {
      icon: Target,
      title: 'Audience Targeting',
      description: 'Precision audience analysis and content personalization',
      premium: true
    }
  ]

  const mockSuggestions = [
    {
      type: 'trending',
      content: 'Luxury morning routines are trending 📈 Perfect time to share your VIP content!',
      confidence: 95,
      impact: 'High'
    },
    {
      type: 'optimization',
      content: 'Add more emojis for 23% higher engagement ✨💎',
      confidence: 88,
      impact: 'Medium'
    },
    {
      type: 'timing',
      content: 'Post in 2 hours for optimal reach (3.2x more views)',
      confidence: 92,
      impact: 'High'
    }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    setAiSuggestions([])
    
    // Mock AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockContent = {
      post: "✨ Just dropped exclusive VIP content that's absolutely game-changing! 💎\n\nThis behind-the-scenes look into my creative process is exactly what my community has been asking for. The response has been incredible! 🚀\n\n#VIPExclusive #CreatorLife #LuxuryContent #CABANA",
      video: "Hook: 'The one thing that changed my entire creator journey...'\n\nIntro: Welcome back VIP members! Today I'm sharing something I've never talked about before.\n\nMain Content:\n- My biggest breakthrough moment\n- The strategy that 10x'd my income\n- Exclusive tips for VIP members only\n\nCall to Action: Drop a 💎 if this helped you!",
      photo: "Behind the luxury ✨ This golden hour shot perfectly captures the essence of the CABANA lifestyle. Sometimes the most beautiful moments happen when you're not even trying. 💫\n\n#GoldenHour #LuxuryLifestyle #CreatorLife #Authentic #VIPMoments",
      audio: "Welcome to another exclusive VIP episode! I'm your host, and today we're diving deep into the psychology of premium content creation.\n\nIn this episode:\n- The luxury mindset shift\n- Building VIP communities\n- Monetization strategies that actually work\n\nLet's get started..."
    }
    
    setGeneratedContent(mockContent[selectedContentType as keyof typeof mockContent])
    setAiSuggestions(mockSuggestions)
    setIsGenerating(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="w-12 h-12 glass-card-premium rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">AI Content Creator</h2>
        </motion.div>
        <p className="text-gray-300 text-luxury">Create premium content with AI-powered insights</p>
      </div>

      {/* Content Type Selection */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4 text-luxury">Content Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contentTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedContentType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedContentType === type.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-purple-500/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-3`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-luxury">{type.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4 text-luxury">AI Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                feature.premium 
                  ? 'border-purple-500/30 bg-purple-500/5 vip-glow' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  feature.premium ? 'vip-glow' : 'glass-card'
                }`}>
                  <feature.icon className={`w-5 h-5 ${feature.premium ? 'vip-text' : 'text-purple-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-luxury">{feature.title}</h4>
                    {feature.premium && (
                      <Crown className="w-4 h-4 vip-text" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Generator */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-luxury">Generate Content</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="luxury-button px-6 py-3 rounded-full font-semibold flex items-center gap-2 interactive-scale"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate with AI
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Generated Content */}
              <div className="content-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-luxury">Generated Content</h4>
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                  <pre className="text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>Engagement Score: 94%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>VIP Appeal: High</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:border-purple-500/50 transition-all"
                  >
                    Copy Content
                  </motion.button>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold text-luxury">AI Suggestions</h4>
                </div>
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="content-card p-4 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-200 leading-relaxed mb-2">{suggestion.content}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              suggestion.confidence > 90 ? 'bg-green-400' :
                              suggestion.confidence > 80 ? 'bg-yellow-400' : 'bg-orange-400'
                            }`}></div>
                            <span className="text-gray-400">Confidence: {suggestion.confidence}%</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            suggestion.impact === 'High' ? 'bg-green-500/20 text-green-300' :
                            suggestion.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {suggestion.impact} Impact
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!generatedContent && (
          <div className="text-center py-12">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
            <p className="text-gray-400 text-luxury">Select a content type and click generate to start creating</p>
          </div>
        )}
      </div>

      {/* Premium Upgrade Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-premium p-6 rounded-2xl vip-glow text-center"
      >
        <div className="w-16 h-16 vip-glow rounded-full flex items-center justify-center mx-auto mb-4">
          <Diamond className="w-8 h-8 vip-text" />
        </div>
        <h3 className="text-xl font-bold mb-2 gradient-text">Unlock Premium AI Features</h3>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Get access to advanced trend prediction, audience targeting, and unlimited AI generations
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="luxury-button px-8 py-3 rounded-full font-semibold interactive-scale shimmer"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Upgrade to VIP AI
          </div>
        </motion.button>
        <div className="mt-3 text-sm text-gray-400">
          Starting at $49/month • 7-day free trial
        </div>
      </motion.div>
    </div>
  )
}

export default AIContentCreator 