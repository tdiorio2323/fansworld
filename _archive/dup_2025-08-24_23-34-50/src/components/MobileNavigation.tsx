import React from 'react';
import { Home, Search, Plus, Play, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, path: '/', label: 'Home', type: 'home' },
    { icon: Search, path: '/discover', label: 'Search', type: 'search' },
    { icon: Plus, path: '/upload', label: 'Create', type: 'plus' },
    { icon: Play, path: '/videos', label: 'Videos', type: 'video' },
  ];

  const renderIcon = (item: any) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    if (item.type === 'home') {
      return (
        <Home 
          className={`w-7 h-7 ${isActive ? 'fill-white text-white' : 'text-white'}`}
          fill={isActive ? 'currentColor' : 'currentColor'}
        />
      );
    }
    
    if (item.type === 'search') {
      return (
        <div className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
      );
    }
    
    if (item.type === 'plus') {
      return (
        <div className="w-11 h-11 rounded-xl border-2 border-white flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
      );
    }
    
    if (item.type === 'video') {
      return (
        <div className="w-11 h-11 rounded-xl border-2 border-white flex items-center justify-center">
          <Play className="w-6 h-6 text-white" fill="currentColor" />
        </div>
      );
    }
    
    return <Icon className="w-7 h-7 text-white" />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black z-50 pb-safe">
      <div className="flex items-center justify-around py-4 px-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
          >
            {renderIcon(item)}
          </button>
        ))}
        
        {/* Profile Avatar with Red Dot */}
        <button
          onClick={() => navigate('/profile')}
          className="relative flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-11 h-11 border-2 border-white">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gray-600 text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {/* Red notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black" />
        </button>
      </div>
    </div>
  );
};