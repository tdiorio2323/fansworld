import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// Import only basic components that don't have complex database dependencies
import LandingPage from './pages/LandingPage'
// Temporarily disable complex components that depend on missing database tables
// import Auth from './pages/Auth'
// import Dashboard from './pages/Dashboard'
// import CreatorHome from './pages/CreatorHome'
// import Waitlist from './pages/Waitlist'
// import { AuthProvider } from './hooks/useAuth'
// import { ProtectedRoute } from './components/ProtectedRoute'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
})

// Simple placeholder components
const ComingSoon = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
    <div className="text-center text-white">
      <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
      <p className="text-xl">This feature is being set up with the proper database schema.</p>
      <a href="/" className="text-purple-300 hover:text-white mt-4 inline-block">
        ← Back to Landing Page
      </a>
    </div>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Temporarily remove AuthProvider to avoid auth hook errors */}
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Temporarily show ComingSoon for all other routes */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App