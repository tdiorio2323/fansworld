'use client';

import { motion } from 'framer-motion';
import { Shield, FileText, AlertCircle } from 'lucide-react';

export default function TermsPage() {
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
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-8 py-24"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={40} className="text-blue-400" />
            </div>
            <h1 className="text-display mb-6 text-gradient-gold">
              Terms of Service
            </h1>
            <p className="text-subtitle text-gray-300 max-w-2xl mx-auto">
              By using the Cabana platform, you agree to these terms and conditions, 
              our Acceptable Use Policy, payment terms, and community guidelines.
            </p>
            <div className="flex items-center justify-center mt-6 text-gray-400">
              <FileText size={16} className="mr-2" />
              <span className="text-sm">Last updated: September 2025</span>
            </div>
          </motion.div>

          {/* Content */}
          <div className="glass-card p-12">
            <motion.div variants={itemVariants} className="space-y-12">
              
              {/* Important Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="text-yellow-400 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-title text-yellow-300 mb-2">Important Notice</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This is placeholder legal content. All terms must be reviewed and approved 
                      by qualified legal counsel before deployment to production.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptance Section */}
              <section>
                <h2 className="text-title text-white mb-6">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    By accessing and using the Cabana platform ("Service"), you accept and agree to 
                    be bound by the terms and provision of this agreement.
                  </p>
                  <p>
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </section>

              {/* Use License Section */}
              <section>
                <h2 className="text-title text-white mb-6">2. Use License</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Permission is granted to temporarily use Cabana for personal, non-commercial 
                    transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Under this license you may not:</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for commercial purposes or public display</li>
                      <li>Attempt to reverse engineer any software contained on the platform</li>
                      <li>Remove any copyright or proprietary notations from the materials</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Payment Terms Section */}
              <section>
                <h2 className="text-title text-white mb-6">3. Payment Terms</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    All payments are processed securely through our payment partners. By making a 
                    purchase, you agree to our payment processing terms.
                  </p>
                  <p>
                    Subscription fees are billed in advance and are non-refundable except as 
                    required by applicable law.
                  </p>
                </div>
              </section>

              {/* Community Guidelines Section */}
              <section>
                <h2 className="text-title text-white mb-6">4. Community Guidelines</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Cabana is committed to maintaining a safe and respectful environment for all users.
                  </p>
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Prohibited Content includes:</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Illegal or harmful content</li>
                      <li>Harassment, bullying, or discrimination</li>
                      <li>Spam or misleading information</li>
                      <li>Copyright infringement</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy Section */}
              <section>
                <h2 className="text-title text-white mb-6">5. Privacy</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Your privacy is important to us. Please refer to our{' '}
                    <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Privacy Policy
                    </a>{' '}
                    for information about how we collect, use, and share your data.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="pt-8 border-t border-gray-700">
                <h2 className="text-title text-white mb-6">Contact Information</h2>
                <div className="text-gray-300">
                  <p className="mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p>Email: legal@cabanagrp.com</p>
                    <p>Address: [Legal Address Required]</p>
                  </div>
                </div>
              </section>

            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="flex justify-center mt-12">
            <div className="flex gap-4">
              <a 
                href="/privacy" 
                className="glass-button"
              >
                <FileText size={16} />
                Privacy Policy
              </a>
              <a 
                href="/contact" 
                className="glass-button"
              >
                <Shield size={16} />
                Contact Legal
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}