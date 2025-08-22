import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      icon: Star,
      price: { monthly: 0, annual: 0 },
      features: [
        'Basic profile setup',
        'Up to 5 posts per month',
        'Basic analytics',
        'Community access',
        'Mobile app access'
      ],
      limitations: [
        'Limited customization',
        'Cabana branding',
        'Basic support'
      ],
      popular: false,
      cta: 'Get Started Free'
    },
    {
      name: 'Creator',
      description: 'For serious content creators',
      icon: Zap,
      price: { monthly: 15, annual: 150 },
      features: [
        'Everything in Free',
        'Unlimited posts',
        'Advanced analytics',
        'Custom profile themes',
        'Priority support',
        'Subscriber management',
        'Revenue tracking',
        'Live streaming',
        'Direct messaging'
      ],
      limitations: [],
      popular: true,
      cta: 'Start Creating'
    },
    {
      name: 'Pro',
      description: 'For established creators',
      icon: Crown,
      price: { monthly: 35, annual: 350 },
      features: [
        'Everything in Creator',
        'Advanced fan engagement tools',
        'Custom integrations',
        'White-label options',
        'API access',
        'Advanced moderation tools',
        'Multi-language support',
        'Dedicated account manager',
        'Custom domain support'
      ],
      limitations: [],
      popular: false,
      cta: 'Go Pro'
    },
    {
      name: 'Enterprise',
      description: 'For agencies and large creators',
      icon: Sparkles,
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Everything in Pro',
        'Multiple creator accounts',
        'Advanced security features',
        'Custom development',
        'On-premise deployment',
        'SLA guarantees',
        '24/7 phone support',
        'Training & onboarding',
        'Custom contracts'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales'
    }
  ]

  const addOns = [
    {
      name: 'Premium Analytics',
      price: 10,
      description: 'Advanced insights and reporting tools'
    },
    {
      name: 'Video Calls',
      price: 20,
      description: 'One-on-one video calls with fans'
    },
    {
      name: 'Custom Merchandise',
      price: 25,
      description: 'Sell branded merchandise through your profile'
    },
    {
      name: 'Advanced Automation',
      price: 15,
      description: 'Automated responses and content scheduling'
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No, there are no setup fees or hidden costs. The price you see is what you pay.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent <span className="text-purple-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises. 
            Start free and scale as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`font-medium ${isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
              Annual
            </span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Save 20%
            </Badge>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon
              const price = typeof plan.price.monthly === 'number' 
                ? (isAnnual ? plan.price.annual : plan.price.monthly)
                : plan.price.monthly
              
              return (
                <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.popular ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.popular ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {typeof price === 'number' ? `$${price}` : price}
                      </div>
                      {typeof price === 'number' && (
                        <div className="text-sm text-gray-500">
                          per {isAnnual ? 'year' : 'month'}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      asChild 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      <Link to={plan.name === 'Enterprise' ? '/support/contact' : '/auth/register'}>
                        {plan.cta}
                      </Link>
                    </Button>
                    
                    <div className="text-left space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Add-on Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-purple-600">${addon.price}/mo</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of creators building their businesses on Cabana</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth/register">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link to="/support/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage