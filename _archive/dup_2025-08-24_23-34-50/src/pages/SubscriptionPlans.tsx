import React, { useState } from 'react'
import { Check, Crown, Star, Zap, Shield, Users, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuthSystem'
import { useStripePayments } from '@/hooks/useStripePayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PlanFeature {
  included: boolean
  text: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  description: string
  badge?: string
  popular?: boolean
  features: PlanFeature[]
  color: string
  icon: any
}

export default function SubscriptionPlans() {
  const { user } = useAuth()
  const { createSubscription, loading } = useStripePayments()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Explorer',
      price: 0,
      interval: 'month',
      description: 'Perfect for getting started',
      features: [
        { included: true, text: 'Basic content access' },
        { included: true, text: 'Limited messaging' },
        { included: true, text: 'Community features' },
        { included: false, text: 'VIP content' },
        { included: false, text: 'Priority support' },
        { included: false, text: 'Custom requests' }
      ],
      color: 'from-gray-500 to-gray-600',
      icon: Users
    },
    {
      id: 'premium',
      name: 'VIP Member',
      price: 29.99,
      interval: 'month',
      description: 'Full access to premium content',
      popular: true,
      badge: 'Most Popular',
      features: [
        { included: true, text: 'All basic features' },
        { included: true, text: 'Unlimited messaging' },
        { included: true, text: 'VIP exclusive content' },
        { included: true, text: 'Priority support' },
        { included: true, text: 'Monthly video calls' },
        { included: false, text: 'Custom content requests' }
      ],
      color: 'from-purple-500 to-pink-500',
      icon: Crown
    },
    {
      id: 'elite',
      name: 'Elite VIP',
      price: 99.99,
      interval: 'month',
      description: 'Ultimate luxury experience',
      badge: 'Premium',
      features: [
        { included: true, text: 'All VIP features' },
        { included: true, text: 'Custom content requests' },
        { included: true, text: 'Weekly 1-on-1 calls' },
        { included: true, text: 'Behind-the-scenes access' },
        { included: true, text: 'Personal merchandise' },
        { included: true, text: 'Meet & greet priority' }
      ],
      color: 'from-yellow-500 to-orange-500',
      icon: Star
    }
  ]

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setError('Please sign in to subscribe')
      return
    }

    if (planId === 'free') {
      // Handle free plan logic
      setError('Free plan is already active!')
      return
    }

    setSelectedPlan(planId)
    setError('')

    try {
      const plan = plans.find(p => p.id === planId)
      if (!plan) return

      await createSubscription({
        planId,
        planName: plan.name,
        amount: plan.price,
        interval: plan.interval
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription')
      setSelectedPlan(null)
    }
  }

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
    const Icon = plan.icon
    const isSelected = selectedPlan === plan.id
    
    return (
      <Card className={`relative glass-morphism border-border/60 transition-all duration-300 hover:scale-105 ${
        plan.popular ? 'ring-2 ring-primary/50' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        
        {/* Popular Badge */}
        {plan.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className={`bg-gradient-to-r ${plan.color} text-white px-4 py-1`}>
              {plan.badge}
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {plan.description}
          </CardDescription>
          
          <div className="mt-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">
                ${plan.price}
              </span>
              <span className="text-muted-foreground">
                /{plan.interval}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Features List */}
          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  feature.included 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <Check className="w-3 h-3" />
                </div>
                <span className={`text-sm ${
                  feature.included 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <Button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading && isSelected}
            className={`w-full ${
              plan.price === 0 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : `bg-gradient-to-r ${plan.color} hover:opacity-90`
            }`}
          >
            {loading && isSelected ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {plan.price === 0 ? (
                  <>
                    <Users className="w-4 h-4" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Subscribe Now
                  </>
                )}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      <div className="container mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              Choose Your Experience
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive content and get closer to your favorite creators with our premium subscription plans
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-morphism border-border/60">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Feature Comparison</CardTitle>
              <CardDescription>
                See what's included with each subscription tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left py-3 px-4 font-medium">Features</th>
                      <th className="text-center py-3 px-4 font-medium">Explorer</th>
                      <th className="text-center py-3 px-4 font-medium">VIP Member</th>
                      <th className="text-center py-3 px-4 font-medium">Elite VIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Basic content access',
                      'Community features',
                      'Messaging',
                      'VIP exclusive content',
                      'Priority support',
                      'Video calls',
                      'Custom requests',
                      'Behind-the-scenes',
                      'Personal merchandise'
                    ].map((feature, index) => (
                      <tr key={index} className="border-b border-border/30">
                        <td className="py-3 px-4 text-sm">{feature}</td>
                        <td className="text-center py-3 px-4">
                          {index < 3 ? (
                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {index < 6 ? (
                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure payments powered by Stripe • Cancel anytime • 30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}