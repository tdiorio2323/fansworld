import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Shield, Users, Globe, Star, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  const teamMembers = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '/team/sarah.jpg' },
    { name: 'Mike Chen', role: 'CTO', image: '/team/mike.jpg' },
    { name: 'Emily Rodriguez', role: 'Head of Creator Relations', image: '/team/emily.jpg' },
    { name: 'David Kim', role: 'Head of Product', image: '/team/david.jpg' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Creator First',
      description: 'We believe creators should own their content and build direct relationships with their fans'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data and content are protected with bank-level security and privacy controls'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building genuine connections between creators and fans in a respectful environment'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Empowering creators worldwide to monetize their passion and connect with global audiences'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-purple-600">Cabana</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're building the future of creator-fan relationships. A platform where creators 
            can truly own their content and build sustainable businesses while fans get 
            unprecedented access to their favorite creators.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize content creation and empower creators to build sustainable businesses 
                by fostering direct, meaningful relationships with their audiences.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe every creator deserves the tools and platform to monetize their passion 
                while maintaining full control over their content and community.
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/auth/register">Join Our Mission</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/images/mission-illustration.svg" 
                alt="Our Mission" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100,000+</div>
              <div className="text-gray-600">Subscribers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$5M+</div>
              <div className="text-gray-600">Creator Earnings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-xl mb-8">Be part of the creator economy revolution</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link to="/support/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage