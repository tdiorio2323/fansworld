'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Scale, FileText, ArrowLeft, ExternalLink, Clock } from 'lucide-react'

import { EnhancedGlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

export default function TermsOfServicePage() {
  const lastUpdated = "September 12, 2024"

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using CABANA (the Platform), you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "CABANA is a premium creator monetization platform that connects content creators with their audience through subscription-based and pay-per-view content models.",
        "These Terms of Service apply to all users of the Platform, including creators, subscribers, and visitors."
      ]
    },
    {
      title: "2. Platform Description",
      content: [
        "CABANA is a luxury digital platform designed for premium content creators to monetize their work through:",
        "• Subscription-based content access",
        "• Pay-per-view messaging and content",
        "• Live streaming and video calls",
        "• Tip and gift systems",
        "• Custom content requests",
        "• Premium fan engagement tools"
      ]
    },
    {
      title: "3. User Eligibility and Registration",
      content: [
        "You must be at least 18 years of age to use this Platform.",
        "You must provide accurate, current, and complete information during registration.",
        "You are responsible for safeguarding your account credentials.",
        "Creators must verify their identity through our Know Your Customer (KYC) process.",
        "All users must comply with applicable laws in their jurisdiction."
      ]
    },
    {
      title: "4. Content Guidelines and Policies",
      content: [
        "All content must comply with applicable laws and regulations.",
        "Content must be original or properly licensed by the creator.",
        "Prohibited content includes but is not limited to:",
        "• Illegal activities or content",
        "• Non-consensual content",
        "• Content involving minors",
        "• Hate speech or harassment",
        "• Spam or misleading information",
        "CABANA reserves the right to remove content that violates these guidelines."
      ]
    },
    {
      title: "5. Financial Terms and Payment Processing",
      content: [
        "All payments are processed through Stripe, our secure payment processor.",
        "Creators receive 80% of all earnings, with CABANA retaining 20% as a platform fee.",
        "Payouts to creators are processed weekly for balances over $50.",
        "All transactions are subject to applicable taxes, which users are responsible for.",
        "Chargebacks and disputes are handled according to Stripe's policies.",
        "Subscription renewals are automatic unless canceled by the subscriber."
      ]
    },
    {
      title: "6. Intellectual Property Rights",
      content: [
        "Creators retain ownership of all content they upload to the Platform.",
        "By uploading content, creators grant CABANA a non-exclusive license to display and distribute the content.",
        "Users may not screenshot, record, or redistribute creator content without explicit permission.",
        "CABANA's platform technology, design, and branding are protected by intellectual property laws.",
        "Any unauthorized use of CABANA's intellectual property is strictly prohibited."
      ]
    },
    {
      title: "7. Privacy and Data Protection",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for details on data collection and usage.",
        "We implement industry-standard security measures to protect user data.",
        "Personal information is encrypted and stored securely.",
        "We do not sell personal information to third parties.",
        "Users have the right to request deletion of their data upon account closure."
      ]
    },
    {
      title: "8. Prohibited Activities",
      content: [
        "Users are prohibited from:",
        "• Creating multiple accounts to circumvent restrictions",
        "• Using automated systems or bots",
        "• Attempting to hack or compromise platform security",
        "• Engaging in fraudulent payment activities",
        "• Harassing or stalking other users",
        "• Sharing or selling account access",
        "Violations may result in account suspension or termination."
      ]
    },
    {
      title: "9. Account Suspension and Termination",
      content: [
        "CABANA reserves the right to suspend or terminate accounts for violations of these Terms.",
        "Users may close their accounts at any time through account settings.",
        "Upon termination, access to paid content will be revoked.",
        "Outstanding creator earnings will be paid out according to our payout schedule.",
        "Some provisions of these Terms will survive account termination."
      ]
    },
    {
      title: "10. Limitation of Liability",
      content: [
        "CABANA provides the Platform as is without warranties of any kind.",
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability is limited to the amount paid by the user in the past 12 months.",
        "We do not guarantee continuous, uninterrupted access to the Platform.",
        "Users acknowledge that internet-based platforms carry inherent risks."
      ]
    },
    {
      title: "11. Dispute Resolution",
      content: [
        "Any disputes arising from these Terms will be resolved through binding arbitration.",
        "Arbitration will be conducted under the rules of the American Arbitration Association.",
        "Users waive the right to participate in class action lawsuits.",
        "California state law governs these Terms and any disputes.",
        "Exclusive jurisdiction lies with the courts of California, USA."
      ]
    },
    {
      title: "12. Modifications to Terms",
      content: [
        "CABANA reserves the right to modify these Terms at any time.",
        "Users will be notified of significant changes via email and platform notifications.",
        "Continued use of the Platform after changes constitutes acceptance of new Terms.",
        "Users who disagree with changes may terminate their accounts.",
        "The effective date of changes will be clearly indicated."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
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
            <Link href="/legal/privacy">
              <FrostedButton variant="ghost" size="sm">
                <Shield size={16} />
                Privacy Policy
              </FrostedButton>
            </Link>
            <Link href="/support">
              <FrostedButton variant="ghost" size="sm">
                Support
              </FrostedButton>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Scale className="w-10 h-10 text-cyan-300" />
            </div>
            
            <h1 className="font-bebas text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-white/60">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>Version 2.1</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <EnhancedGlassCard variant="frosted" size="default">
              <GlassCardContent>
                <h2 className="font-bold text-white mb-4 text-center">Quick Navigation</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {sections.slice(0, 8).map((section, index) => (
                    <a
                      key={index}
                      href={`#section-${index + 1}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors text-center p-2 rounded-lg hover:bg-white/5"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </GlassCardContent>
            </EnhancedGlassCard>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <EnhancedGlassCard variant="premium" size="lg">
              <GlassCardHeader>
                <GlassCardTitle>Welcome to CABANA</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-white/80 leading-relaxed mb-4">
                  CABANA is a premium creator monetization platform that empowers content creators 
                  to build sustainable businesses through direct fan engagement and luxury digital experiences.
                </p>
                <p className="text-white/80 leading-relaxed mb-4">
                  These Terms of Service (\\"Terms\\") govern your use of CABANA and form a legally binding 
                  agreement between you and CABANA, Inc. Please read them carefully.
                </p>
                <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
                  <p className="text-amber-200 text-sm">
                    <strong>Important:</strong> By using CABANA, you agree to these Terms. If you don't agree, 
                    please don't use our platform. We may update these Terms from time to time, 
                    and we'll notify you of any significant changes.
                  </p>
                </div>
              </GlassCardContent>
            </EnhancedGlassCard>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index + 1}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <EnhancedGlassCard variant="diamond" size="lg">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-left">{section.title}</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-white/80 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </GlassCardContent>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <EnhancedGlassCard variant="holographic" size="lg">
              <GlassCardHeader>
                <GlassCardTitle>Questions About These Terms?</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-white/80 mb-6 leading-relaxed">
                  If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                  We're here to help and provide clarity on any aspect of our platform policies.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">Contact Information</h3>
                    <div className="text-white/70 text-sm space-y-1">
                      <p>Email: legal@cabanagrp.com</p>
                      <p>Support: support@cabanagrp.com</p>
                      <p>Address: [Your Business Address]</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Link href="/support">
                      <FrostedButton variant="holographic" size="lg" className="w-full">
                        <ExternalLink size={16} />
                        Contact Support
                      </FrostedButton>
                    </Link>
                    <Link href="/legal/privacy">
                      <FrostedButton variant="premium" size="lg" className="w-full">
                        <Shield size={16} />
                        Privacy Policy
                      </FrostedButton>
                    </Link>
                  </div>
                </div>
              </GlassCardContent>
            </EnhancedGlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}