import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Crown, Users, TrendingUp, DollarSign, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="w-8 h-8 text-purple-400" />
              <span className="gradient-text text-2xl font-bold">CABANA</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.avatar} 
                  alt={user?.username}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div>
                  <div className="font-semibold">{user?.username}</div>
                  <div className="text-xs text-purple-400 capitalize">{user?.tier}</div>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.username}</span>!
          </h1>
          <p className="text-gray-300">
            Manage your creator business and connect with your premium community.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">1.2K</span>
            </div>
            <p className="text-gray-300">Total Fans</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">89</span>
            </div>
            <p className="text-gray-300">VIP Members</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">$2.3K</span>
            </div>
            <p className="text-gray-300">Monthly Revenue</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">+15%</span>
            </div>
            <p className="text-gray-300">Growth Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/home" className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creator Home</h3>
              <p className="text-gray-300">Your premium creator feed and community</p>
            </div>
          </Link>
          
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="text-center">
              <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">VIP Management</h3>
              <p className="text-gray-300">Manage your exclusive VIP members</p>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-300">Track your performance and growth</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New VIP member joined', time: '2 hours ago', icon: Crown },
              { action: 'Content uploaded successfully', time: '4 hours ago', icon: TrendingUp },
              { action: 'Payment received', time: '1 day ago', icon: DollarSign },
              { action: 'New fan subscription', time: '2 days ago', icon: Users },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl">
                <activity.icon className="w-6 h-6 text-purple-400" />
                <div className="flex-1">
                  <p className="text-white">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard