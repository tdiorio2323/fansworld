import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to auth page which handles both login and registration
    navigate('/auth', { replace: true })
  }, [navigate])

  return null
}