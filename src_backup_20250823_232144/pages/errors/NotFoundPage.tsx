import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const suggestions = [
    {
      title: 'Explore Creators',
      description: 'Discover amazing content from our featured creators',
      link: '/discover',
      icon: Search
    },
    {
      title: 'Browse Categories',
      description: 'Find creators by category and interests',
      link: '/categories',
      icon: Search
    },
    {
      title: 'Help Center',
      description: 'Get answers to frequently asked questions',
      link: '/support/help',
      icon: HelpCircle
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-purple-200 mb-4">404</div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🏖️</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          It looks like you've wandered off the beaten path. The page you're looking for 
          might have been moved, deleted, or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button 
            asChild 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Here's what you can do instead:
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={suggestion.link}>
                        Explore
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Or search for what you need:
          </h3>
          <div className="max-w-md mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search creators, content, or help topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Search
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-gray-500">
          <p>Still need help? <Link to="/support/contact" className="text-purple-600 hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage