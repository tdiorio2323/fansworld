import React from 'react'
import Link from 'next/link'

export default function CabanaHomePage() {
  return (
    <div className="min-h-screen cabana-gradient-fixed flex flex-col justify-center items-center pt-16 pb-8">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-4xl w-full">
        <div className="glass p-10 rounded-3xl shadow-2xl text-center backdrop-blur-md bg-white/10 border border-white/20">
          <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">
            <span className="text-white">Your Premium Content</span>
            <span className="cabana-gradient-text ml-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">Destination</span>
          </h1>
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Connect with exclusive creators, access premium content, and join a community
            of passionate subscribers. Start your journey today.
          </p>
          <div className="flex gap-6 justify-center flex-wrap mt-6">
            <Link
              href="/discover"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-colors border-2 border-white/30"
            >
              Explore Creators
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold rounded-xl shadow-lg transition-colors bg-white/10"
            >
              Become a Creator
            </Link>
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
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Premium Content</h3>
              <p className="text-gray-600">Access exclusive content from top creators worldwide</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with creators through real-time messaging</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
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
              <svg className="h-6 w-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-gray-700">Bank-Level Security</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-gray-700">Creator-First Platform</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
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
          <Link
            href="/discover"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 font-medium rounded-lg transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  )
}
