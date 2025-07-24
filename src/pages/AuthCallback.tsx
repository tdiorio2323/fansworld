import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate auth callback processing
    setTimeout(() => {
      navigate('/home', { replace: true })
    }, 2000)
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Crown className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-subtle" />
        <h1 className="text-2xl font-bold text-gradient mb-2">Processing Authentication...</h1>
        <p className="text-muted-foreground">Please wait while we verify your credentials</p>
      </div>
    </div>
  )
}