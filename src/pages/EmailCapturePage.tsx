import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmailCapture from "@/components/EmailCapture";

export default function EmailCapturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="btn-glass px-4 py-2 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cabana
            </Button>
          </Link>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-luxury font-semibold text-lg">Cabana</span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-tight">
                Welcome to the
                <br />
                <span className="text-holographic">Elite Circle</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Join thousands of premium creators and fans in the most exclusive content platform. 
                Experience luxury, privacy, and unparalleled quality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Email Capture Component */}
        <EmailCapture />

        {/* Features Grid */}
        <section className="px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Premium Content",
                  description: "Access exclusive content from top creators with our luxury platform experience",
                  gradient: "from-primary/20 to-accent/20"
                },
                {
                  title: "VIP Community",
                  description: "Connect with elite creators and fans in our private, secure community space",
                  gradient: "from-accent/20 to-primary/20"
                },
                {
                  title: "Early Access",
                  description: "Be the first to experience new features and content before anyone else",
                  gradient: "from-primary/20 to-accent/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="card-glass p-6 lg:p-8 text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    <Sparkles className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card-glass p-8 lg:p-12"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Trusted by Top Creators
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                {[10000, 500, 1000000, 50].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
                      {stat.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {index === 0 && "Active Users"}
                      {index === 1 && "Creators"}
                      {index === 2 && "Content Views"}
                      {index === 3 && "Countries"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm">
        <p>&copy; 2024 Cabana. All rights reserved. Made with luxury in mind.</p>
      </footer>
    </div>
  );
}