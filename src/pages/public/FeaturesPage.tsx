import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Star, Heart, MessageCircle, DollarSign, Shield, Zap, 
  Camera, Video, Headphones, FileText, Users, BarChart,
  Smartphone, Globe, Lock, Clock, Gift, Trophy,
  TrendingUp, Bell, Share, Download
} from 'lucide-react'
import { Link } from 'react-router-dom'

const FeaturesToPage = () => {
  const coreFeatures = [
    {
      icon: Star,
      title: 'Premium Content',
      description: 'Share exclusive photos, videos, live streams, and more',
      category: 'Content'
    },
    {
      icon: MessageCircle,
      title: 'Direct Messaging',
      description: 'Real-time chat with your fans and subscribers',
      category: 'Communication'
    },
    {
      icon: DollarSign,
      title: 'Multiple Revenue Streams',
      description: 'Subscriptions, tips, PPV messages, and custom requests',
      category: 'Monetization'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Bank-level security with full privacy controls',
      category: 'Security'
    }
  ]

  const contentFeatures = [
    {
      icon: Camera,
      title: 'Photo Sharing',
      description: 'High-quality photo uploads with advanced editing tools'
    },
    {
      icon: Video,
      title: 'Video Content',
      description: 'HD video uploads, live streaming, and video calls'
    },
    {
      icon: Headphones,
      title: 'Audio Content',
      description: 'Podcasts, voice messages, and audio-only content'
    },
    {
      icon: FileText,
      title: 'Text & Stories',
      description: 'Blog posts, stories, and written content'
    }
  ]

  const engagementFeatures = [
    {
      icon: Heart,
      title: 'Likes & Reactions',
      description: 'Fans can like and react to your content'
    },
    {
      icon: MessageCircle,
      title: 'Comments',
      description: 'Engage with fans through comments and replies'
    },
    {
      icon: Users,
      title: 'Fan Clubs',
      description: 'Create exclusive fan clubs with special perks'
    },
    {
      icon: Gift,
      title: 'Virtual Gifts',
      description: 'Fans can send virtual gifts and tips'
    }
  ]

  const analyticsFeatures = [
    {
      icon: BarChart,
      title: 'Detailed Analytics',
      description: 'Track your performance and audience insights'
    },
    {
      icon: TrendingUp,
      title: 'Growth Tracking',
      description: 'Monitor your subscriber and revenue growth'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock achievements and milestones'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Never miss important interactions with fans'
    }
  ]

  const mobileFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Full-featured mobile web app'
    },
    {
      icon: Download,
      title: 'Offline Access',
      description: 'Download content for offline viewing'
    },
    {
      icon: Share,
      title: 'Easy Sharing',
      description: 'Share your profile across social media'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with fans worldwide'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for <span className="text-purple-600">Creators</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to create, connect, and monetize your content. 
            Built by creators, for creators.
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link to="/auth/register">Start Creating Today</Link>
          </Button>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">{feature.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Content Creation Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Engagement Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Fan Engagement</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {engagementFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-pink-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Analytics & Growth</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {analyticsFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Mobile Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mobileFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8">Join thousands of creators already using Cabana</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth/register">Sign Up Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link to="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesToPage