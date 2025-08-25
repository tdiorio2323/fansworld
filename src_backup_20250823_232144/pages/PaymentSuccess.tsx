import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Crown, Gift, Sparkles, ArrowRight, Home, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuthSystem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ParallaxBackground } from '@/components/ParallaxBackground'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [celebrationComplete, setCelebrationComplete] = useState(false)

  const sessionId = searchParams.get('session_id')
  const planName = searchParams.get('plan') || 'VIP Membership'
  const amount = searchParams.get('amount') || '29.99'

  useEffect(() => {
    // Trigger celebration animation
    const timer = setTimeout(() => {
      setCelebrationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const benefits = [
    {
      icon: Crown,
      title: 'VIP Access Unlocked',
      description: 'Exclusive content and premium features now available'
    },
    {
      icon: Sparkles,
      title: 'Priority Support',
      description: 'Get faster responses and dedicated customer care'
    },
    {
      icon: Gift,
      title: 'Welcome Bonus',
      description: 'Special welcome package sent to your account'
    }
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white overflow-hidden">
      <ParallaxBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        
        {/* Success Animation */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center transition-all duration-1000 ${
              celebrationComplete ? 'scale-100' : 'scale-150'
            }`}>
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Celebration Sparkles */}
            {!celebrationComplete && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Welcome to VIP!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your subscription to <strong>{planName}</strong> is now active
          </p>
        </div>

        {/* Payment Details */}
        <Card className="glass-morphism border-border/60">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              Payment Successful
            </CardTitle>
            <CardDescription>
              Thank you for your subscription! Here are the details:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="font-medium">Subscription Plan</p>
                <p className="text-sm text-muted-foreground">{planName}</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="font-medium">Amount Charged</p>
                <p className="text-sm text-muted-foreground">Monthly subscription</p>
              </div>
              <p className="text-2xl font-bold">${amount}</p>
            </div>
            
            {sessionId && (
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium">Transaction ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{sessionId.slice(0, 20)}...</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="glass-morphism border-border/60">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Here's what you can do with your new VIP access:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          >
            <User className="w-4 h-4 mr-2" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need help? Our VIP support team is here for you.
          </p>
          <Button variant="ghost" size="sm">
            Contact Support
          </Button>
        </div>

        {/* Receipt Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            📧 A receipt has been sent to your email address
          </p>
        </div>
      </motion.div>
    </div>
  )
}