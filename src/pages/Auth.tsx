import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ArrowLeft, Eye, EyeOff, Crown } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, register, error, isAuthenticated, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/home'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    clearError()
  }, [isLogin, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, username, password)
      }
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Back to landing */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to CABANA
      </Link>

      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-purple-400 mr-2" />
              <span className="gradient-text text-2xl font-bold">CABANA</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join CABANA'}
            </h1>
            <p className="text-gray-300">
              {isLogin 
                ? 'Sign in to your premium creator account'
                : 'Create your luxury creator experience'
              }
            </p>
          </div>

          {/* Auth Toggle */}
          <div className="flex glass-card rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                isLogin
                  ? 'luxury-button text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                !isLogin
                  ? 'luxury-button text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="creator@cabana.com"
              />
            </div>

            {/* Username (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="creator_username"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-12"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full luxury-button py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In to CABANA' : 'Join CABANA'}
                </>
              )}
            </button>
          </form>

          {/* Additional Options */}
          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">
                Forgot your password?
              </a>
            </div>
          )}

          {/* Social Login Placeholder */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-gray-400 text-sm mb-4">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="glass-card p-3 rounded-xl border border-white/20 hover:border-purple-500/50 transition-all text-white text-sm">
                Google
              </button>
              <button className="glass-card p-3 rounded-xl border border-white/20 hover:border-purple-500/50 transition-all text-white text-sm">
                Twitter
              </button>
            </div>
          </div>

          {/* VIP Preview */}
          {!isLogin && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">VIP Creator Benefits</span>
              </div>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Premium analytics and insights</li>
                <li>• Advanced creator tools</li>
                <li>• Priority support</li>
                <li>• Exclusive community access</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          By continuing, you agree to CABANA's{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}

export default Auth