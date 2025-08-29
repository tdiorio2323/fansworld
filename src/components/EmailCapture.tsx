import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Email capture failed');
      }

      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Email capture failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="card-glass p-8 sm:p-12 lg:p-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 opacity-20">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute bottom-6 left-6 opacity-20">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            
            {/* Header */}
            <div className="mb-8 sm:mb-12">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4 sm:mb-6 leading-tight">
                Join the Elite Community
              </h2>
              
              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Get exclusive access to premium content, early features, and connect with top creators in our luxury platform
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading || isSubmitted}
                    className="w-full h-12 sm:h-14 px-4 sm:px-6 text-base sm:text-lg rounded-xl 
                             bg-background/50 backdrop-blur-xl border-border/60 
                             focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                             placeholder:text-muted-foreground/60 transition-all duration-300
                             hover:border-primary/30"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitted || !email}
                  className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl 
                           btn-luxury whitespace-nowrap min-w-fit
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span>Welcome!</span>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline">Join Cabana</span>
                      <span className="sm:hidden">Join</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <span>Exclusive Content</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent/60" />
                <span>Early Access</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <span>VIP Community</span>
              </div>
            </motion.div>

            {/* Privacy Notice */}
            <p className="text-muted-foreground/60 text-xs sm:text-sm mt-6 sm:mt-8 leading-relaxed">
              No spam, unsubscribe at any time. We respect your privacy and will never share your information.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}