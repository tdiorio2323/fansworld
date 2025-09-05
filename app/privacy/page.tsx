'use client';

import { motion } from 'framer-motion';
import { Lock, Eye, Database, Shield } from 'lucide-react';

export default function PrivacyPage() {
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

  const privacyFeatures = [
    {
      icon: Lock,
      title: 'Data Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols.'
    },
    {
      icon: Eye,
      title: 'Transparent Practices',
      description: 'Clear disclosure of what data we collect and how we use it.'
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'Your data is stored securely with enterprise-grade infrastructure.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'We never sell your personal information to third parties.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-purple-400" />
            </div>
            <h1 className="text-display mb-6 text-gradient-gold">
              Privacy Policy
            </h1>
            <p className="text-subtitle text-gray-300 max-w-2xl mx-auto">
              Your privacy is fundamental to our platform. This policy explains how we collect, 
              use, and protect your personal information on Cabana.
            </p>
            <div className="flex items-center justify-center mt-6 text-gray-400">
              <Eye size={16} className="mr-2" />
              <span className="text-sm">Last updated: September 2025</span>
            </div>
          </motion.div>

          {/* Privacy Features */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {privacyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className="glass-card p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <div className="glass-card p-12">
            <motion.div variants={itemVariants} className="space-y-12">
              
              {/* Information We Collect */}
              <section>
                <h2 className="text-title text-white mb-6">1. Information We Collect</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    We collect information you provide directly to us when you create an account, 
                    use our services, or communicate with us.
                  </p>
                  
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Personal Information:</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Email address and username</li>
                      <li>Profile information and preferences</li>
                      <li>Payment and billing information</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>

                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Usage Information:</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Device and browser information</li>
                      <li>IP address and location data</li>
                      <li>Usage patterns and interactions</li>
                      <li>Performance and analytics data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h2 className="text-title text-white mb-6">2. How We Use Your Information</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    We use the information we collect to provide, maintain, and improve our services.
                  </p>
                  
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Primary Uses:</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Provide and operate the Cabana platform</li>
                      <li>Process payments and transactions</li>
                      <li>Send important updates and notifications</li>
                      <li>Provide customer support</li>
                      <li>Improve our services and user experience</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section>
                <h2 className="text-title text-white mb-6">3. Information Sharing</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share information in the following limited circumstances:
                  </p>
                  
                  <div className="ml-6">
                    <ul className="list-disc ml-6 space-y-2">
                      <li>With service providers who assist in operating our platform</li>
                      <li>When required by law or to protect our rights</li>
                      <li>In connection with a business transfer or acquisition</li>
                      <li>With your explicit consent</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-title text-white mb-6">4. Data Security</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    We implement appropriate technical and organizational measures to protect 
                    your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mt-6">
                    <div className="flex items-start">
                      <Shield className="text-purple-400 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="text-title text-purple-300 mb-2">Security Measures</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          We use industry-standard encryption, secure servers, and regular security audits 
                          to protect your data. However, no method of transmission over the internet is 100% secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-title text-white mb-6">5. Your Rights</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    You have certain rights regarding your personal information:
                  </p>
                  
                  <div className="ml-6">
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Access and review your personal information</li>
                      <li>Correct or update your information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt out of marketing communications</li>
                      <li>Request data portability</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="pt-8 border-t border-gray-700">
                <h2 className="text-title text-white mb-6">Contact Us</h2>
                <div className="text-gray-300">
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p>Email: privacy@cabanagrp.com</p>
                    <p>Data Protection Officer: dpo@cabanagrp.com</p>
                    <p>Address: [Privacy Office Address Required]</p>
                  </div>
                </div>
              </section>

            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="flex justify-center mt-12">
            <div className="flex gap-4">
              <a 
                href="/terms" 
                className="glass-button"
              >
                <Shield size={16} />
                Terms of Service
              </a>
              <a 
                href="/contact" 
                className="glass-button"
              >
                <Database size={16} />
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}