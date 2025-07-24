import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  ArrowRight,
  Play,
  Users,
  DollarSign,
  Lock
} from 'lucide-react'

const features = [
  {
    icon: Crown,
    title: 'Premium Creator Tools',
    description: 'Advanced analytics, custom branding, and exclusive monetization features for elite creators.',
    gradient: 'from-yellow-400 to-amber-600'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and privacy controls to protect your content and subscriber data.',
    gradient: 'from-blue-400 to-cyan-600'
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description: 'Real-time insights and AI-powered recommendations to maximize your earning potential.',
    gradient: 'from-green-400 to-emerald-600'
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Get paid instantly with our crypto and traditional payment systems.',
    gradient: 'from-purple-400 to-pink-600'
  }
]

const stats = [
  { value: '500K+', label: 'Active Creators' },
  { value: '$2.5B+', label: 'Creator Earnings' },
  { value: '15M+', label: 'Subscribers' },
  { value: '99.9%', label: 'Uptime' }
]

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gradient flex items-center gap-2">
              <Crown className="h-8 w-8" />
              Fansworld
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-foreground/80 hover:text-foreground transition-colors">Features</Link>
              <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/creators" className="text-foreground/80 hover:text-foreground transition-colors">Creators</Link>
              <Link to="/support" className="text-foreground/80 hover:text-foreground transition-colors">Support</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="default" className="gap-2">
                  Start Creating
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-32 left-20 text-primary/20 animate-bounce-subtle">
          <Sparkles size={32} />
        </div>
        <div className="absolute top-40 right-32 text-accent/20 animate-bounce-subtle delay-500">
          <Heart size={28} />
        </div>
        <div className="absolute bottom-40 left-40 text-primary/20 animate-bounce-subtle delay-1000">
          <Star size={24} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-gradient">Premium</span>
              <br />
              <span className="text-holographic">Creator Platform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join the most exclusive creator economy. Build your empire, monetize your passion, 
              and connect with premium subscribers who value quality content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button variant="default" size="xl" className="gap-3">
                <Crown className="h-6 w-6" />
                Start Your Empire
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button variant="glass" size="xl" className="gap-3">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Built for Elite Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature designed to maximize your earning potential and provide 
              unparalleled value to your most dedicated fans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="crystal" className="group cursor-pointer">
                <CardHeader>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Showcase */}
      <section className="py-32 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Join Elite Creators
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Our platform empowers creators to build sustainable businesses and 
            connect with audiences who truly value premium content.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { metric: '300%', label: 'Average revenue increase' },
              { metric: '2.5M', label: 'Monthly active subscribers' },
              { metric: '97%', label: 'Creator satisfaction rate' }
            ].map((item, index) => (
              <Card key={index} variant="glass" className="text-center p-8">
                <div className="text-4xl font-bold text-gradient mb-2">{item.metric}</div>
                <div className="text-muted-foreground">{item.label}</div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="default" size="xl" className="gap-3">
                <Users className="h-6 w-6" />
                Join as Creator
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button variant="glass" size="xl" className="gap-3">
                <DollarSign className="h-5 w-5" />
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="card-crystal p-16 rounded-3xl">
            <Crown className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Ready to Rule Your Niche?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who've already built their empires on Fansworld. 
              Your premium audience is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="default" size="xl" className="gap-3">
                  <Lock className="h-6 w-6" />
                  Start Premium Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-8 md:mb-0">
              <Crown className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">Fansworld</span>
            </div>
            
            <div className="flex gap-8 text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-border/20 text-muted-foreground">
            <p>&copy; 2024 Fansworld. Built for premium creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}