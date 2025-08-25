import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, MessageCircle, Book, Video, CreditCard, 
  Settings, Shield, Users, HelpCircle, ArrowRight,
  Clock, ThumbsUp, Star, ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Cabana',
      icon: Book,
      color: 'bg-blue-100 text-blue-600',
      articleCount: 15
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Tips for creating and managing content',
      icon: Video,
      color: 'bg-purple-100 text-purple-600',
      articleCount: 23
    },
    {
      id: 'payments-billing',
      title: 'Payments & Billing',
      description: 'Payment methods, subscriptions, and earnings',
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
      articleCount: 18
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: Settings,
      color: 'bg-orange-100 text-orange-600',
      articleCount: 12
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      description: 'Keep your account safe and secure',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      articleCount: 10
    },
    {
      id: 'community',
      title: 'Community Guidelines',
      description: 'Rules and best practices for the community',
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
      articleCount: 8
    }
  ]

  const popularArticles = [
    {
      id: 1,
      title: 'How to set up your creator profile',
      category: 'Getting Started',
      views: 15420,
      likes: 234,
      readTime: '5 min',
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      title: 'Understanding subscription pricing',
      category: 'Payments & Billing',
      views: 12890,
      likes: 189,
      readTime: '7 min',
      lastUpdated: '2025-01-20'
    },
    {
      id: 3,
      title: 'Best practices for content uploads',
      category: 'Content Creation',
      views: 11650,
      likes: 156,
      readTime: '10 min',
      lastUpdated: '2025-01-18'
    },
    {
      id: 4,
      title: 'Privacy settings explained',
      category: 'Privacy & Security',
      views: 9870,
      likes: 145,
      readTime: '6 min',
      lastUpdated: '2025-01-22'
    },
    {
      id: 5,
      title: 'Community guidelines overview',
      category: 'Community Guidelines',
      views: 8970,
      likes: 134,
      readTime: '8 min',
      lastUpdated: '2025-01-10'
    }
  ]

  const quickLinks = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      link: '/support/contact',
      icon: MessageCircle,
      isExternal: false
    },
    {
      title: 'Report an Issue',
      description: 'Report bugs or technical problems',
      link: '/support/tickets/new',
      icon: HelpCircle,
      isExternal: false
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features for Cabana',
      link: '/support/feedback',
      icon: Star,
      isExternal: false
    },
    {
      title: 'System Status',
      description: 'Check current system status',
      link: 'https://status.cabana.com',
      icon: Clock,
      isExternal: true
    }
  ]

  const faqItems = [
    {
      question: 'How do I become a creator on Cabana?',
      answer: 'To become a creator, simply sign up for an account and complete your profile setup. You can then start uploading content and set your subscription pricing.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for subscription payments. Creators can withdraw earnings via bank transfer or PayPal.'
    },
    {
      question: 'How do subscriptions work?',
      answer: 'Subscriptions are monthly recurring payments that give fans access to a creator\'s premium content. Creators set their own pricing and fans are charged automatically each month.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'You can report content by clicking the report button on any post or by contacting our moderation team directly through the support center.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers to your questions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-4 text-lg border-2 border-gray-200 focus:border-purple-500"
            />
            <Button 
              className="absolute right-2 top-2 h-10 bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                  <Link to={`/support/help/${category.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-lg ${category.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {category.articleCount} articles
                          </Badge>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{category.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Popular Articles */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="space-y-4">
                {popularArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/support/help/articles/${article.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600 block mb-2"
                          >
                            {article.title}
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span>{article.readTime} read</span>
                            <span>•</span>
                            <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{article.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{article.views} views</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/support/help/all">
                    View All Articles
                  </Link>
                </Button>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/support/faq">
                    View All FAQs
                  </Link>
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Links */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Help?</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon
                  const LinkComponent = link.isExternal ? 'a' : Link
                  const linkProps = link.isExternal 
                    ? { href: link.link, target: '_blank', rel: 'noopener noreferrer' }
                    : { to: link.link }
                  
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <LinkComponent {...linkProps}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{link.title}</h4>
                              <p className="text-sm text-gray-600">{link.description}</p>
                            </div>
                            {link.isExternal ? (
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </CardContent>
                      </LinkComponent>
                    </Card>
                  )
                })}
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Still Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Our support team is here to help you 24/7.</p>
                  <div className="space-y-3">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                      <Link to="/support/contact">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/support/tickets">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        My Support Tickets
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>
                        <strong>Response Time:</strong>
                        <br />Usually within 2 hours
                      </div>
                      <div>
                        <strong>Available:</strong>
                        <br />24/7 Support
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenterPage