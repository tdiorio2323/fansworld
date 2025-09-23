"use client";

import React from "react";
import { motion } from "framer-motion";
import { VipWaitlistForm } from "@/components/VipWaitlistForm";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, Users, TrendingUp, Shield } from "lucide-react";

export default function VipWaitlistPage() {
  const handleWaitlistSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/vip/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      return await response.json();
    } catch (error) {
      console.error("Error joining waitlist:", error);
      throw error;
    }
  };

  const features = [
    {
      icon: Crown,
      title: "VIP Early Access",
      description: "Be the first to experience CABANA's revolutionary creator tools"
    },
    {
      icon: Star,
      title: "Exclusive Features",
      description: "Access premium features and beta tools before anyone else"
    },
    {
      icon: Zap,
      title: "Priority Support",
      description: "Get dedicated support and direct feedback channels"
    },
    {
      icon: Users,
      title: "Creator Network",
      description: "Connect with top creators and industry professionals"
    },
    {
      icon: TrendingUp,
      title: "Growth Tools",
      description: "Advanced analytics and growth optimization features"
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Enhanced security and brand protection features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Crown className="h-4 w-4 mr-2" />
            VIP Exclusive
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-6">
            CABANA VIP
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the most exclusive creator platform. Limited access. Unlimited potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Features Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Why VIP?</h2>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                          <feature.icon className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <GlassCard className="p-6" gradient>
                <h3 className="text-xl font-bold text-white mb-4">Join the Elite</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">500+</div>
                    <div className="text-sm text-gray-300">VIP Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">$2M+</div>
                    <div className="text-sm text-gray-300">Creator Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">50M+</div>
                    <div className="text-sm text-gray-300">Total Reach</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <VipWaitlistForm onSubmit={handleWaitlistSubmit} />
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <GlassCard className="p-8 max-w-4xl mx-auto" blur="sm">
            <h3 className="text-2xl font-bold text-white mb-6">Trusted by Top Creators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {/* Placeholder for creator logos/testimonials */}
              <div className="flex items-center justify-center h-12 bg-white/10 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center justify-center h-12 bg-white/10 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center justify-center h-12 bg-white/10 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center justify-center h-12 bg-white/10 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}