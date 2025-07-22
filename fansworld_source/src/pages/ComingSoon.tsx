import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Mail, 
  Key, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Star,
  Check,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const { toast } = useToast();

  // Handle VIP code from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vipFromUrl = urlParams.get('vip');
    const refFromUrl = urlParams.get('ref');
    
    if (vipFromUrl) {
      setInviteCode(vipFromUrl.toUpperCase());
      
      // Track VIP link visit if ref parameter exists
      if (refFromUrl) {
        // Record VIP link click (fire and forget)
        supabase.rpc('record_link_click', {
          short_code: refFromUrl,
          user_agent: navigator.userAgent,
          referer: document.referrer || null,
          device_type: /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          session_id: sessionStorage.getItem('session_id') || Math.random().toString(36)
        }).catch(console.error);
      }
    }
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmittingWaitlist(true);
    
    try {
      // Store in Supabase waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{
          email: email,
          source: 'coming_soon_page',
          metadata: { referrer: window.location.href }
        }]);

      if (error) {
        console.error('Waitlist error:', error);
        toast({
          title: "Error",
          description: "Failed to join waitlist. Please try again.",
          variant: "destructive"
        });
      } else {
        setWaitlistSubmitted(true);
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you when TD Studios launches.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  const handleInviteCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;

    setIsSubmittingCode(true);
    
    try {
      // Check if invite code exists and is valid
      const { data: invite, error } = await supabase
        .from('invites')
        .select('*')
        .eq('code', inviteCode.toUpperCase())
        .eq('used', false)
        .single();

      if (error || !invite) {
        toast({
          title: "Invalid Code",
          description: "This invitation code is not valid or has already been used.",
          variant: "destructive"
        });
      } else {
        // Redirect to registration with invite code
        window.location.href = `/register?invite=${inviteCode.toUpperCase()}`;
      }
    } catch (error) {
      console.error('Invite code error:', error);
      toast({
        title: "Error",
        description: "Failed to validate invitation code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const features = [
    {
      icon: Crown,
      title: "Elite Management",
      description: "Premium creator management with dedicated account managers"
    },
    {
      icon: TrendingUp,
      title: "400% Growth",
      description: "Average earnings increase within 6 months of joining"
    },
    {
      icon: Users,
      title: "Exclusive Network",
      description: "Connect with top female creators and influencers"
    },
    {
      icon: Star,
      title: "Full-Service",
      description: "Content, branding, legal, and business development"
    }
  ];

  const stats = [
    { value: "250+", label: "Creators Managed" },
    { value: "$50M+", label: "Revenue Generated" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Crown className="h-16 w-16 text-yellow-400 mr-4" />
            <h1 className="text-6xl font-bold text-white font-['Playfair_Display']">
              TD Studios
            </h1>
          </div>
          
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Coming Soon
          </Badge>
          
          <h2 className="text-4xl font-bold text-white mb-6 font-['Playfair_Display']">
            Premier Creator Management Agency
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-['Cormorant_Garamond']">
            We're building the future of creator management. Exclusively representing female content creators, 
            influencers, and streamers with proven growth strategies and elite business support.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Waitlist Card */}
          <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white font-['Playfair_Display']">
                Join the Waitlist
              </CardTitle>
              <CardDescription className="text-gray-300 font-['Cormorant_Garamond']">
                Be the first to know when we launch and get priority access to our exclusive creator management services.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {waitlistSubmitted ? (
                <div className="text-center py-8">
                  <Check className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
                  <p className="text-gray-300">
                    We'll email you as soon as TD Studios launches.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/20 border-white/10 text-white placeholder-gray-400"
                    required
                  />
                  
                  <Button 
                    type="submit"
                    disabled={isSubmittingWaitlist}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isSubmittingWaitlist ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                </form>
              )}
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  🎉 Early subscribers get <strong>50% off</strong> first month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Early Access Card */}
          <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
            <CardHeader className="text-center">
              <Key className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white font-['Playfair_Display']">
                Early Access
              </CardTitle>
              <CardDescription className="text-gray-300 font-['Cormorant_Garamond']">
                Have an invitation code? Get immediate access to TD Studios and start growing your creator business today.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleInviteCodeSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your invitation code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="bg-black/20 border-white/10 text-white placeholder-gray-400 text-center font-mono tracking-wider"
                  maxLength={12}
                />
                
                <Button 
                  type="submit"
                  disabled={isSubmittingCode}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                >
                  {isSubmittingCode ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Access Platform
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  ✨ Invited creators skip the waitlist entirely
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16 bg-white/10" />

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12 font-['Playfair_Display']">
            Why Top Creators Choose TD Studios
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="backdrop-blur-xl bg-black/20 border border-white/10 text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Packages Preview */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12 font-['Playfair_Display']">
            Management Packages
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$2,500", commission: "30%", popular: false },
              { name: "Premium", price: "$5,000", commission: "25%", popular: true },
              { name: "Elite", price: "$10,000", commission: "20%", popular: false }
            ].map((plan, index) => (
              <Card key={index} className={`backdrop-blur-xl bg-black/20 border border-white/10 relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-white mt-4">{plan.price}</div>
                  <div className="text-gray-400">per month</div>
                  <div className="text-purple-400 text-sm">{plan.commission} commission</div>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    disabled
                    className="w-full bg-gray-600 text-gray-300 cursor-not-allowed"
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Questions? Email us at <a href="mailto:hello@tdstudiosny.com" className="text-purple-400 hover:text-purple-300">hello@tdstudiosny.com</a>
          </p>
          <p className="text-sm text-gray-500">
            TD Studios © 2024 • New York, NY • Exclusively for Female Creators
          </p>
        </div>
      </div>
    </div>
  );
}