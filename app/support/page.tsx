'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  Book,
  Users,
  Shield,
  CreditCard,
  Settings,
  Video,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react'

import { EnhancedGlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  lastUpdated: Date
}

export default function SupportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'help' | 'contact' | 'tickets'>('help')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  const faqCategories = [
    { id: 'account', name: 'Account & Billing', icon: <CreditCard size={20} /> },
    { id: 'creator', name: 'Creator Tools', icon: <Video size={20} /> },
    { id: 'payments', name: 'Payments & Payouts', icon: <CreditCard size={20} /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings size={20} /> },
    { id: 'safety', name: 'Safety & Privacy', icon: <Shield size={20} /> }
  ]

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a creator account on CABANA?',
      answer: 'To create a creator account, click "Start Building" on our homepage, complete the registration form, verify your email, and go through our KYC (Know Your Customer) verification process. This usually takes 1-2 business days.',
      category: 'account'
    },
    {
      id: '2', 
      question: 'What percentage does CABANA take from my earnings?',
      answer: 'CABANA takes a 20% platform fee from all earnings. This means creators keep 80% of all subscription fees, tips, and pay-per-view content sales. There are no hidden fees or additional charges.',
      category: 'payments'
    },
    {
      id: '3',
      question: 'How often are creator payouts processed?',
      answer: 'Payouts are processed weekly every Monday for balances over $50. Payments are sent directly to your connected bank account or Stripe account. Smaller balances roll over to the next payout period.',
      category: 'payments'
    },
    {
      id: '4',
      question: 'Can I customize my creator page design?',
      answer: 'Yes! CABANA offers multiple luxury themes including glass-morphism, holographic, neon, and premium designs. You can customize colors, layouts, and branding to match your personal style.',
      category: 'creator'
    },
    {
      id: '5',
      question: 'Is my personal information secure on CABANA?',
      answer: 'Absolutely. We use bank-level encryption, secure servers, and comply with all data protection regulations. Your personal information is never shared with third parties without your explicit consent.',
      category: 'safety'
    },
    {
      id: '6',
      question: 'How do I set up pay-per-view messages?',
      answer: 'In your creator dashboard, go to Messages, compose your message, and toggle "PPV Message" before sending. Set your price (minimum $1) and the message will be locked until the recipient pays to view it.',
      category: 'creator'
    },
    {
      id: '7',
      question: 'Can subscribers cancel their subscriptions anytime?',
      answer: 'Yes, subscribers can cancel their subscriptions at any time from their account settings. They will retain access to your content until the end of their current billing period.',
      category: 'account'
    },
    {
      id: '8',
      question: 'What should I do if I encounter a technical issue?',
      answer: 'First, try refreshing your browser and clearing your cache. If the issue persists, contact our technical support team with details about your browser, device, and the specific problem you are experiencing.',
      category: 'technical'
    }
  ]

  const supportTickets: SupportTicket[] = [
    {
      id: 'TICK-001',
      subject: 'Payout delay inquiry',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date('2024-09-10'),
      lastUpdated: new Date('2024-09-11')
    },
    {
      id: 'TICK-002',
      subject: 'Custom theme request',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date('2024-09-08'),
      lastUpdated: new Date('2024-09-09')
    }
  ]

  const filteredFAQs = faqItems.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      })
      
      alert('Your message has been sent successfully! We will get back to you within 24 hours.')
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-amber-400 bg-amber-400/20 border-amber-400/30'
      case 'in-progress': return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      case 'resolved': return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
      default: return 'text-white/60 bg-white/10 border-white/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-amber-400'
      case 'low': return 'text-emerald-400'
      default: return 'text-white/60'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <FrostedButton variant="ghost" size="sm">
                <ArrowLeft size={16} />
                Back
              </FrostedButton>
            </Link>
            <HolographicLogo size="sm" animated={true} showText={true} variant="default" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms">
              <FrostedButton variant="ghost" size="sm">
                Terms
              </FrostedButton>
            </Link>
            <Link href="/legal/privacy">
              <FrostedButton variant="ghost" size="sm">
                Privacy
              </FrostedButton>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-bebas text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
              Support Center
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Get help with your CABANA experience. We're here to support your creator journey.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <EnhancedGlassCard variant="frosted" size="default">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'help', label: 'Help Center', icon: <Book size={18} /> },
                  { id: 'contact', label: 'Contact Us', icon: <MessageCircle size={18} /> },
                  { id: 'tickets', label: 'My Tickets', icon: <Users size={18} /> }
                ].map((tab) => (
                  <FrostedButton
                    key={tab.id}
                    variant={activeTab === tab.id ? 'holographic' : 'ghost'}
                    size="lg"
                    className="flex-1 whitespace-nowrap"
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.icon}
                    {tab.label}
                  </FrostedButton>
                ))}
              </div>
            </EnhancedGlassCard>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Help Center Tab */}
            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Search */}
                <EnhancedGlassCard variant="premium" size="lg">
                  <GlassCardContent>
                    <div className="relative max-w-2xl mx-auto">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                      <input
                        type="text"
                        placeholder="Search for help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg"
                      />
                    </div>
                  </GlassCardContent>
                </EnhancedGlassCard>

                {/* FAQ Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {faqCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <EnhancedGlassCard 
                        variant="diamond" 
                        size="sm" 
                        animation="float"
                        className="text-center cursor-pointer group"
                      >
                        <GlassCardContent>
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            {category.icon}
                          </div>
                          <p className="font-medium text-white text-sm">{category.name}</p>
                        </GlassCardContent>
                      </EnhancedGlassCard>
                    </motion.div>
                  ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <EnhancedGlassCard variant="frosted" size="default">
                        <GlassCardContent>
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <h3 className="font-semibold text-white pr-4">{faq.question}</h3>
                            {expandedFAQ === faq.id ? (
                              <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {expandedFAQ === faq.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-4 pb-4"
                              >
                                <div className="border-t border-white/10 pt-4">
                                  <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </GlassCardContent>
                      </EnhancedGlassCard>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Options */}
                <EnhancedGlassCard variant="holographic" size="lg">
                  <GlassCardHeader>
                    <GlassCardTitle>Still Need Help?</GlassCardTitle>
                    <GlassCardDescription>
                      Our support team is available 24/7 to assist you
                    </GlassCardDescription>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Live Chat</h3>
                        <p className="text-white/70 text-sm mb-4">Get instant help from our support team</p>
                        <FrostedButton variant="holographic" size="sm" className="w-full">
                          Start Chat
                        </FrostedButton>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Email Support</h3>
                        <p className="text-white/70 text-sm mb-4">Response within 24 hours</p>
                        <FrostedButton 
                          variant="luxury" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setActiveTab('contact')}
                        >
                          Send Email
                        </FrostedButton>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Phone className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Phone Support</h3>
                        <p className="text-white/70 text-sm mb-4">For urgent creator issues</p>
                        <FrostedButton variant="neon" size="sm" className="w-full">
                          Call Now
                        </FrostedButton>
                      </div>
                    </div>
                  </GlassCardContent>
                </EnhancedGlassCard>
              </motion.div>
            )}

            {/* Contact Form Tab */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="max-w-2xl mx-auto">
                  <EnhancedGlassCard variant="premium" size="lg">
                    <GlassCardHeader>
                      <GlassCardTitle>Contact Our Support Team</GlassCardTitle>
                      <GlassCardDescription>
                        Fill out the form below and we'll get back to you within 24 hours
                      </GlassCardDescription>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <form onSubmit={handleContactSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Category
                          </label>
                          <select
                            value={contactForm.category}
                            onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                          >
                            <option value="general">General Support</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Payments</option>
                            <option value="creator">Creator Tools</option>
                            <option value="safety">Safety & Privacy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                            placeholder="Brief description of your issue"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Message *
                          </label>
                          <textarea
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            rows={6}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                            placeholder="Please provide detailed information about your issue or question..."
                            required
                          />
                        </div>

                        <FrostedButton
                          type="submit"
                          variant="holographic"
                          size="xl"
                          glow="rainbow"
                          className="w-full font-bold"
                          loading={submitLoading}
                          disabled={submitLoading || !contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
                        >
                          {submitLoading ? (
                            'Sending Message...'
                          ) : (
                            <>
                              <Send size={18} />
                              Send Message
                            </>
                          )}
                        </FrostedButton>
                      </form>
                    </GlassCardContent>
                  </EnhancedGlassCard>
                </div>
              </motion.div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bebas text-2xl font-bold text-white">Your Support Tickets</h2>
                  <FrostedButton 
                    variant="holographic" 
                    size="lg"
                    onClick={() => setActiveTab('contact')}
                  >
                    New Ticket
                  </FrostedButton>
                </div>

                {supportTickets.length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <EnhancedGlassCard key={ticket.id} variant="frosted" size="lg">
                        <GlassCardContent>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-white">{ticket.subject}</h3>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                  {ticket.status.replace('-', ' ').toUpperCase()}
                                </span>
                                <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <span>#{ticket.id}</span>
                                <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                                <span>Updated: {ticket.lastUpdated.toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <FrostedButton variant="ghost" size="sm">
                              <ExternalLink size={16} />
                              View
                            </FrostedButton>
                          </div>
                        </GlassCardContent>
                      </EnhancedGlassCard>
                    ))}
                  </div>
                ) : (
                  <EnhancedGlassCard variant="premium" size="lg" className="text-center">
                    <GlassCardContent>
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">No Support Tickets</h3>
                      <p className="text-white/70 mb-6">
                        You haven't submitted any support tickets yet. If you need help, don't hesitate to contact us!
                      </p>
                      <FrostedButton 
                        variant="holographic" 
                        size="lg"
                        onClick={() => setActiveTab('contact')}
                      >
                        Create First Ticket
                      </FrostedButton>
                    </GlassCardContent>
                  </EnhancedGlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}