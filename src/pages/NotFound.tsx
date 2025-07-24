import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, ArrowLeft, Sparkles, Crown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-primary/20 animate-bounce-subtle">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-20 right-20 text-accent/20 animate-bounce-subtle delay-500">
        <Crown size={28} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <Card variant="glass" className="p-12">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-gradient mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-holographic">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like this premium content has moved to an exclusive location. 
              Let's get you back to the luxury experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/home">
              <Button variant="default" size="lg" className="gap-3">
                <Home className="h-5 w-5" />
                Return Home
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="glass" size="lg" className="gap-3">
                <ArrowLeft className="h-5 w-5" />
                Back to Landing
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}