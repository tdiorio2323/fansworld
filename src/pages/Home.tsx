import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the main home experience
    navigate('/home', { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Crown className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-subtle" />
        <h1 className="text-2xl font-bold text-gradient">Redirecting to Fansworld...</h1>
      </div>
    </div>
  )
}