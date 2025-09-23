"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FrostedButton } from "@/components/ui/frosted-button";
import { Crown, CheckCircle, Star, Share2, Twitter, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export default function VipSuccessPage() {
  const shareText = "I just joined the exclusive CABANA VIP waitlist! 🚀 The future of creator platforms is coming.";
  const shareUrl = "https://cabana.app/vip";

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "text-blue-400 hover:text-blue-300"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#", // Instagram doesn't support direct sharing URLs
      color: "text-pink-400 hover:text-pink-300"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=Join CABANA VIP&body=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "text-green-400 hover:text-green-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <GlassCard className="p-8 md:p-12 text-center" gradient blur="lg">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              duration: 0.8,
              bounce: 0.4 
            }}
            className="mb-8"
          >
            <div className="relative">
              <Crown className="mx-auto h-24 w-24 text-yellow-400 drop-shadow-lg" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", duration: 0.6 }}
                className="absolute -top-2 -right-2"
              >
                <CheckCircle className="h-8 w-8 text-green-400 bg-slate-900 rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Welcome to VIP!
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              🎉 You're officially on the CABANA VIP waitlist
            </p>
            <p className="text-gray-400 leading-relaxed">
              Get ready for exclusive early access to the most revolutionary creator platform. 
              We'll notify you as soon as it's your turn to join the future of content creation.
            </p>
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard className="p-6 mb-6" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                What happens next?
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>You'll receive a confirmation email shortly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Get exclusive updates on CABANA development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Be first to access beta features and tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Receive your personal invitation when ready</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Share2 className="h-5 w-5" />
              Spread the word
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Help your friends join the VIP list too!
            </p>
            <div className="flex justify-center gap-4">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.name !== "Email" ? "_blank" : undefined}
                  rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                  className={`p-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 ${link.color}`}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <FrostedButton variant="ghost" size="lg">
                Back to Home
              </FrostedButton>
            </Link>
            <Link href="/vip">
              <FrostedButton variant="primary" size="lg">
                Invite Friends
              </FrostedButton>
            </Link>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="text-xs text-gray-500">
              Keep an eye on your inbox and follow us on social media for the latest updates.
            </p>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}