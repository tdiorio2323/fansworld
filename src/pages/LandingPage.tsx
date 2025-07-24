import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Users, Zap, Crown, ArrowRight, Shield, Sparkles, Diamond, Gem } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 nav-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="gradient-text text-2xl font-bold flex items-center gap-2">
              <Diamond className="w-8 h-8" />
              CABANA
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-300 transition-colors text-luxury">Features</a>
              <a href="#creators" className="hover:text-purple-300 transition-colors text-luxury">For Creators</a>
              <a href="#pricing" className="hover:text-purple-300 transition-colors text-luxury">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/auth" className="luxury-button px-6 py-2 rounded-full text-white font-semibold interactive-scale">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="glass-card-premium p-4 rounded-full pulse-glow">
                <Crown className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 fade-in">
              Welcome to <span className="gradient-text">CABANA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto fade-in text-luxury">
              The ultimate luxury platform for creators and their exclusive communities. 
              Premium content, VIP experiences, and unparalleled creator tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 fade-in">
              <Link to="/waitlist" className="luxury-button px-10 py-5 rounded-full text-white font-semibold text-lg flex items-center gap-3 interactive-scale shimmer">
                <Sparkles className="w-6 h-6" />
                Join Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/auth" className="glass-card px-10 py-5 rounded-full text-white font-semibold text-lg border border-white/20 hover:border-purple-500/50 transition-all interactive-scale">
                <div className="flex items-center gap-3">
                  <Gem className="w-5 h-5" />
                  Sign In
                </div>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 status-online rounded-full"></div>
                <span>1M+ Active Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 status-vip rounded-full"></div>
                <span>$50M+ Creator Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="gradient-text">Premium Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-luxury">
              Everything you need to build, manage, and monetize your creator business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="content-card p-8 rounded-3xl interactive-scale">
              <div className="vip-glow w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 vip-text" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-luxury">VIP Experiences</h3>
              <p className="text-gray-300 leading-relaxed">
                Create exclusive VIP tiers with special access, private content, and premium interactions that drive higher engagement and revenue.
              </p>
            </div>
            
            <div className="content-card p-8 rounded-3xl interactive-scale">
              <div className="glass-card-premium w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-luxury">AI-Powered Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced insights and automation to optimize your content strategy, predict trends, and maximize revenue potential.
              </p>
            </div>
            
            <div className="content-card p-8 rounded-3xl interactive-scale">
              <div className="glass-card-premium w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-luxury">Premium Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Bank-level security with content protection, secure payments, privacy controls, and advanced fraud prevention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Spotlight */}
      <section id="creators" className="py-20 px-6 bg-black/20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Join Elite <span className="gradient-text">Creators</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-luxury">
              Trusted by top creators worldwide for premium content and exclusive experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card-premium p-6 rounded-2xl text-center interactive-scale hover:scale-105 transition-transform">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto shimmer"></div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-6 h-6 status-vip rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-gray-900" />
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold mb-2 text-luxury">Creator {i}</h4>
                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  "CABANA transformed my creator business with premium tools and VIP features."
                </p>
                <div className="mt-4 text-xs vip-text font-semibold">
                  ${(Math.random() * 10 + 5).toFixed(1)}K monthly
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="gradient-text">Premium Tiers</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-luxury">
              Choose the perfect plan for your creator journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic */}
            <div className="content-card p-8 rounded-3xl interactive-scale">
              <div className="text-center mb-8">
                <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-luxury">Creator</h3>
                <div className="text-4xl font-bold mb-2">$29<span className="text-lg text-gray-400">/mo</span></div>
                <p className="text-gray-400">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Basic creator tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Community features</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Payment processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Basic analytics</span>
                </li>
              </ul>
              
              <button className="w-full glass-card py-3 rounded-full border border-white/20 hover:border-blue-500/50 transition-all interactive-scale">
                Get Started
              </button>
            </div>
            
            {/* Premium */}
            <div className="glass-card-premium p-8 rounded-3xl ring-2 ring-purple-500 relative pulse-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shimmer">
                Most Popular
              </div>
              
              <div className="text-center mb-8 mt-4">
                <div className="w-12 h-12 vip-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 vip-text" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-luxury">VIP Creator</h3>
                <div className="text-4xl font-bold mb-2">$99<span className="text-lg text-gray-400">/mo</span></div>
                <p className="text-gray-400">For serious creators</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>VIP member management</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>AI content optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Priority support & training</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Custom branding options</span>
                </li>
              </ul>
              
              <button className="w-full luxury-button py-3 rounded-full text-white font-semibold interactive-scale">
                Upgrade to VIP
              </button>
            </div>
            
            {/* Enterprise */}
            <div className="content-card p-8 rounded-3xl interactive-scale">
              <div className="text-center mb-8">
                <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center mx-auto mb-4">
                  <Diamond className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-luxury">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">Custom</div>
                <p className="text-gray-400">White-label solutions</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>White-label platform</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Dedicated support team</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>SLA guarantees</span>
                </li>
              </ul>
              
              <button className="w-full glass-card py-3 rounded-full border border-white/20 hover:border-gray-500/50 transition-all interactive-scale">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239333ea" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Join <span className="gradient-text">CABANA</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto text-luxury leading-relaxed">
              Start building your premium creator business today with our luxury platform designed for success
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth" className="luxury-button px-10 py-5 rounded-full text-white font-semibold text-lg inline-flex items-center gap-3 interactive-scale shimmer">
                <Sparkles className="w-6 h-6" />
                Get Started Now 
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-gray-900"></div>
                  ))}
                </div>
                <span className="text-sm">Join 10,000+ creators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="gradient-text text-2xl font-bold mb-4 flex items-center gap-2">
                <Diamond className="w-6 h-6" />
                CABANA
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                The luxury platform for creators and their exclusive communities.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:border-purple-500/50 transition-all interactive-scale">
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-luxury">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-luxury">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Creator Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-luxury">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <div className="text-center text-gray-400 mb-4 md:mb-0">
              © 2025 CABANA. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 