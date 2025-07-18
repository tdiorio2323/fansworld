import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, Sparkles, Mail } from "lucide-react";

const VALID_PASSWORDS = [
  "FANSWORLD2025",
  "TDSTUDIOS",
  "CABANA",
  "VIP2025",
  "LAUNCH2025"
];

export default function PasswordLanding() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(true);
  const { toast } = useToast();

  // Check if user already has access
  useEffect(() => {
    const hasAccess = sessionStorage.getItem("fansworld_access") === "granted";
    if (hasAccess) {
      window.location.href = "/home";
    }
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("waitlist")
        .select("email")
        .eq("email", email)
        .single();

      if (existing) {
        toast({
          title: "Already on the list!",
          description: "You're already on our exclusive waitlist.",
          variant: "default",
        });
      } else {
        // Add to waitlist
        const { error } = await supabase.from("waitlist").insert({
          email,
          source: "password_landing",
          metadata: {
            timestamp: new Date().toISOString(),
            page: "password_protected_landing"
          }
        });

        if (error) throw error;

        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you as soon as we launch.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password is valid
    if (VALID_PASSWORDS.includes(password.toUpperCase())) {
      // Grant access
      sessionStorage.setItem("fansworld_access", "granted");
      sessionStorage.setItem("fansworld_access_time", new Date().toISOString());
      
      toast({
        title: "Access Granted!",
        description: "Welcome to Fansworld. Redirecting...",
      });

      // Log access attempt
      await supabase.from("waitlist").insert({
        email: `vip_access_${Date.now()}@fansworld.com`,
        source: "password_access",
        metadata: {
          password_used: password.toUpperCase(),
          timestamp: new Date().toISOString()
        }
      });

      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
    } else {
      toast({
        title: "Invalid Password",
        description: "Please check your password and try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-accent/20" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-4 animate-fade-up">
            FANSWORLD
          </h1>
          <p className="text-xl text-gray-400 animate-fade-up animation-delay-200">
            Exclusive Access Only
          </p>
        </div>

        <Card className="card-glass backdrop-blur-xl p-8 animate-fade-up animation-delay-400">
          {showWaitlist ? (
            <>
              {/* Waitlist Form */}
              <div className="space-y-6">
                <div className="text-center">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-display font-semibold mb-2">Join the Waitlist</h2>
                  <p className="text-sm text-gray-400">
                    Be the first to know when we launch
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-luxury bg-black/50 border-white/10"
                    disabled={isLoading}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full btn-chrome hover:scale-105 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Join Exclusive Waitlist
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/50 px-2 text-gray-400">or</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowWaitlist(false)}
                  className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  I have a password →
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Password Form */}
              <div className="space-y-6">
                <div className="text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-display font-semibold mb-2">Enter Password</h2>
                  <p className="text-sm text-gray-400">
                    VIP access only
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-luxury bg-black/50 border-white/10"
                    disabled={isLoading}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full btn-chrome hover:scale-105 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Enter Fansworld
                      </>
                    )}
                  </Button>
                </form>

                <button
                  onClick={() => setShowWaitlist(true)}
                  className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  ← Back to waitlist
                </button>
              </div>
            </>
          )}
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 TD Studios. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-10deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}