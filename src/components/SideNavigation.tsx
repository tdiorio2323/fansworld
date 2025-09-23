import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  MessageCircle, 
  User, 
  Settings, 
  Bookmark, 
  Clock,
  TrendingUp,
  Users,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SideNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const CabanaItems = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: Search, label: 'Search', path: '/explore' },
    { icon: PlusSquare, label: 'Create', path: '/upload' },
    { icon: Heart, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Users, label: 'Following', path: '/following' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onToggle(); // Close Cabana on mobile after navigation
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Side Menu */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-background border-r border-border/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <h1 className="text-2xl font-bold">Cabana</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback>
                  {user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user?.user_metadata?.display_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user?.user_metadata?.username || 'username'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {CabanaItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 px-4"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/20">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 px-4"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Menu Toggle Button Component
export const MenuToggleButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="lg:hidden">
      <Menu className="w-5 h-5" />
    </Button>
  );
};