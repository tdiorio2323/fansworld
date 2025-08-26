import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Users, Zap, Shield, Heart, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Premium Content
            <span className="text-purple-600"> Destination</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with exclusive creators, access premium content, and join a community 
            of passionate subscribers. Start your journey today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/discover">
                Explore Creators <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/register">
                Become a Creator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Why Choose Cabana?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Premium Content</h3>
              <p className="text-gray-600">Access exclusive content from top creators worldwide</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with creators through real-time messaging</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure & Fast</h3>
              <p className="text-gray-600">Secure payments and lightning-fast content delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">Active Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-purple-100">Happy Subscribers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-purple-100">Content Pieces</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$5M+</div>
              <div className="text-purple-100">Creator Earnings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-gray-700">Bank-Level Security</span>
            </div>
            <div className="flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-gray-700">Creator-First Platform</span>
            </div>
            <div className="flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-gray-700">Growing Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-purple-600 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of subscribers discovering amazing content</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/discover">
              Start Exploring
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage