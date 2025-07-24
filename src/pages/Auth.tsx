import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Sparkles, Heart, Star } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  })

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/home'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast({
          title: "Welcome back! ✨",
          description: "You've successfully logged in to Fansworld.",
          variant: "success"
        })
      } else {
        await register(formData)
        toast({
          title: "Account created! 🎉",
          description: "Welcome to the most exclusive creator platform.",
          variant: "success"
        })
      }
      navigate(from, { replace: true })
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-bounce-subtle"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-primary/20 animate-bounce-subtle">
        <Sparkles size={24} />
      </div>
      <div className="absolute top-40 right-32 text-accent/20 animate-bounce-subtle delay-500">
        <Heart size={20} />
      </div>
      <div className="absolute bottom-32 left-40 text-primary/20 animate-bounce-subtle delay-1000">
        <Star size={18} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Fansworld
          </h1>
          <p className="text-muted-foreground text-lg">
            The most exclusive creator platform
          </p>
        </div>

        <Card variant="glass" className="backdrop-blur-2xl border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient">
              {isLogin ? 'Welcome Back' : 'Join Fansworld'}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin 
                ? 'Access your exclusive creator dashboard' 
                : 'Create your premium content empire'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-foreground/90">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Your unique username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required={!isLogin}
                      className="h-14"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium text-foreground/90">
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="How you'll appear to fans"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      required={!isLogin}
                      className="h-14"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/90">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="h-14"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground/90">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="h-14 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary-glow font-semibold"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}