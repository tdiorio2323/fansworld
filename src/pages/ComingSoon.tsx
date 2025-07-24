import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Crown, Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <Card variant="glass" className="p-12">
          <Crown className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Coming Soon
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            This exclusive feature is being crafted with the utmost care. 
            Stay tuned for something extraordinary.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-5 w-5 text-primary animate-bounce-subtle" />
            <span className="text-muted-foreground">Premium experience in development</span>
            <Sparkles className="h-5 w-5 text-accent animate-bounce-subtle delay-500" />
          </div>

          <Link to="/home">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}