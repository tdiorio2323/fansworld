'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Send,
  Heart,
  Smile,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Image as ImageIcon,
  Gift,
  DollarSign,
  Lock,
  Crown,
  Circle,
  Camera,
  Mic,
  Plus,
  X,
  MessageCircle
} from 'lucide-react'

import { EnhancedGlassCard, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

interface Conversation {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  isOnline: boolean
  isVerified: boolean
  lastMessage: {
    content: string
    timestamp: Date
    isRead: boolean
    type: 'text' | 'image' | 'video' | 'tip' | 'ppv'
    price?: number
  }
  unreadCount: number
  isVip: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'video' | 'tip' | 'ppv'
  price?: number
  isPaid?: boolean
  mediaUrl?: string
  isRead: boolean
}

interface User {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  isVerified: boolean
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser] = useState<User>({
    id: 'current-user',
    username: 'you',
    displayName: 'You',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    isVerified: false
  })
  const [showPPVModal, setShowPPVModal] = useState(false)
  const [ppvPrice, setPpvPrice] = useState('')
  const [ppvContent, setPpvContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mock conversations data
    const mockConversations: Conversation[] = Array.from({ length: 10 }, (_, i) => ({
      id: `conv-${i}`,
      username: `creator${i + 1}`,
      displayName: `Creator ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=creator${i + 1}`,
      isOnline: Math.random() > 0.5,
      isVerified: Math.random() > 0.3,
      lastMessage: {
        content: [
          'Hey there! 😘',
          'Just uploaded new content!',
          'Thanks for the tip! ❤️',
          'Check out my latest post',
          'Want to video chat?'
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        isRead: Math.random() > 0.3,
        type: ['text', 'image', 'ppv'][Math.floor(Math.random() * 3)] as any,
        price: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) + 500 : undefined
      },
      unreadCount: Math.floor(Math.random() * 5),
      isVip: Math.random() > 0.7
    }))

    setConversations(mockConversations)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation
      const mockMessages: Message[] = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        senderId: Math.random() > 0.5 ? selectedConversation : currentUser.id,
        content: [
          'Hey! How are you doing today? 😊',
          'Just finished my photo shoot!',
          'Want to see a preview?',
          'Thanks for being such an amazing fan!',
          'Check out my new content 🔥',
          'Love chatting with you ❤️'
        ][Math.floor(Math.random() * 6)],
        timestamp: new Date(Date.now() - (15 - i) * 60 * 1000),
        type: ['text', 'image', 'tip'][Math.floor(Math.random() * 3)] as any,
        price: Math.random() > 0.8 ? Math.floor(Math.random() * 2000) + 300 : undefined,
        isPaid: Math.random() > 0.3,
        mediaUrl: Math.random() > 0.7 ? `https://picsum.photos/300/200?random=${i}` : undefined,
        isRead: Math.random() > 0.2
      }))

      setMessages(mockMessages)
    }
  }, [selectedConversation, currentUser.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const sendPPVMessage = () => {
    if (!ppvContent.trim() || !ppvPrice || !selectedConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: ppvContent,
      timestamp: new Date(),
      type: 'ppv',
      price: parseFloat(ppvPrice) * 100, // Convert to cents
      isRead: false
    }

    setMessages([...messages, message])
    setShowPPVModal(false)
    setPpvContent('')
    setPpvPrice('')
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv =>
    conv.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <HolographicLogo size="sm" animated={true} showText={true} variant="default" />
          <div className="flex items-center gap-4">
            <FrostedButton variant="ghost" size="sm" onClick={() => router.push('/explore')}>
              Explore
            </FrostedButton>
            <FrostedButton variant="ghost" size="sm" onClick={() => router.push('/profile')}>
              Profile
            </FrostedButton>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-white/10 flex flex-col">
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv.id}
                className={`p-4 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedConversation === conv.id ? 'bg-white/10' : ''
                }`}
                onClick={() => setSelectedConversation(conv.id)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conv.avatarUrl}
                      alt={conv.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white truncate">
                        {conv.displayName}
                      </span>
                      {conv.isVerified && (
                        <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                      {conv.isVip && (
                        <Star className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {conv.lastMessage.type === 'ppv' && (
                          <Lock className="w-3 h-3 text-cyan-400" />
                        )}
                        {conv.lastMessage.type === 'tip' && (
                          <Gift className="w-3 h-3 text-pink-400" />
                        )}
                        <span className={`text-sm truncate ${
                          conv.lastMessage.isRead ? 'text-white/60' : 'text-white font-medium'
                        }`}>
                          {conv.lastMessage.content}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-white/50">
                          {conv.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {conv.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-black">
                              {conv.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedConv?.avatarUrl}
                      alt={selectedConv?.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConv?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-slate-900" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {selectedConv?.displayName}
                      </h3>
                      {selectedConv?.isVerified && (
                        <Crown className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm text-white/60">
                      {selectedConv?.isOnline ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FrostedButton variant="ghost" size="sm">
                    <Phone size={16} />
                  </FrostedButton>
                  <FrostedButton variant="ghost" size="sm">
                    <Video size={16} />
                  </FrostedButton>
                  <FrostedButton variant="ghost" size="sm">
                    <MoreHorizontal size={16} />
                  </FrostedButton>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.senderId === currentUser.id ? 'ml-12' : 'mr-12'
                  }`}>
                    {message.type === 'ppv' && !message.isPaid ? (
                      <EnhancedGlassCard variant="obsidian" size="sm" className="p-4">
                        <div className="text-center">
                          <Lock className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                          <p className="text-white/80 text-sm mb-2">Unlock this message</p>
                          <p className="text-cyan-400 font-bold mb-3">
                            ${((message.price || 0) / 100).toFixed(2)}
                          </p>
                          <FrostedButton variant="holographic" size="sm" className="w-full">
                            <DollarSign size={14} />
                            Unlock
                          </FrostedButton>
                        </div>
                      </EnhancedGlassCard>
                    ) : (
                      <EnhancedGlassCard
                        variant={message.senderId === currentUser.id ? 'neon' : 'frosted'}
                        size="sm"
                        className="p-3"
                      >
                        {message.mediaUrl && (
                          <img
                            src={message.mediaUrl}
                            alt="Media"
                            className="w-full rounded-xl mb-2"
                          />
                        )}
                        
                        {message.type === 'tip' && (
                          <div className="flex items-center gap-2 mb-2 text-pink-400">
                            <Gift size={14} />
                            <span className="text-sm font-medium">
                              Tip: ${((message.price || 0) / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-white">{message.content}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/50">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {message.senderId === currentUser.id && (
                            <div className={`w-2 h-2 rounded-full ${
                              message.isRead ? 'bg-cyan-400' : 'bg-white/30'
                            }`} />
                          )}
                        </div>
                      </EnhancedGlassCard>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-end gap-3">
                <div className="flex gap-2">
                  <FrostedButton variant="ghost" size="sm">
                    <Paperclip size={16} />
                  </FrostedButton>
                  <FrostedButton variant="ghost" size="sm">
                    <Camera size={16} />
                  </FrostedButton>
                  <FrostedButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPPVModal(true)}
                  >
                    <Lock size={16} />
                  </FrostedButton>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                
                <div className="flex gap-2">
                  <FrostedButton variant="ghost" size="sm">
                    <Smile size={16} />
                  </FrostedButton>
                  <FrostedButton 
                    variant="holographic" 
                    size="sm"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={16} />
                  </FrostedButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EnhancedGlassCard variant="premium" className="text-center p-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-white/50" />
              <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
              <p className="text-white/70">Choose a conversation from the sidebar to start messaging</p>
            </EnhancedGlassCard>
          </div>
        )}
      </div>

      {/* PPV Message Modal */}
      <AnimatePresence>
        {showPPVModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowPPVModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <EnhancedGlassCard variant="luxury" size="lg" className="w-full max-w-md">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Send PPV Message</h3>
                    <FrostedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPPVModal(false)}
                    >
                      <X size={16} />
                    </FrostedButton>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Message Content
                      </label>
                      <textarea
                        value={ppvContent}
                        onChange={(e) => setPpvContent(e.target.value)}
                        placeholder="Enter your premium message..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={ppvPrice}
                        onChange={(e) => setPpvPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <FrostedButton
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setShowPPVModal(false)}
                      >
                        Cancel
                      </FrostedButton>
                      <FrostedButton
                        variant="holographic"
                        className="flex-1"
                        onClick={sendPPVMessage}
                        disabled={!ppvContent.trim() || !ppvPrice}
                      >
                        <Lock size={16} />
                        Send PPV
                      </FrostedButton>
                    </div>
                  </div>
                </div>
              </EnhancedGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}