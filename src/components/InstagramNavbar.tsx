import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Home,
  Search,
  PlusSquare,
  MessageCircle,
  User,
  Bell,
  Settings,
  Crown,
  LogOut,
  Bookmark,
  Heart,
  TrendingUp,
  DollarSign
} from "lucide-react";

export default function InstagramNavbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Fetch admin status and notifications
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
        setIsAdmin(data?.is_admin || false);
        
        // Mock notification count - replace with real query
        setUnreadNotifications(3);
      };
      fetchUserData();
    }
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  // Instagram-style bottom navigation items
  const bottomNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: `/creator/${user?.user_metadata?.username || 'profile'}`, icon: User, label: 'Profile' },
  ];

  // Instagram-style header for mobile
  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/home" className="text-2xl font-bold text-black">
          Cabana
        </Link>
        
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative">
            <Bell className="w-6 h-6 text-black" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                {unreadNotifications}
              </Badge>
            )}
          </Link>
          
          <Link to="/messages" className="relative">
            <MessageCircle className="w-6 h-6 text-black" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
              2
            </Badge>
          </Link>
        </div>
      </div>
    </div>
  );

  // Instagram-style bottom navigation
  const BottomNavigation = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 transition-all duration-200",
                active ? "text-black" : "text-gray-500"
              )}
            >
              {item.path.includes('profile') ? (
                <Avatar className={cn("w-6 h-6", active && "ring-2 ring-black")}>
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
                  <AvatarFallback className="text-xs">
                    {user?.user_metadata?.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Icon className={cn("w-6 h-6", active && "fill-current")} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  // OnlyFans-style desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow">
        {/* Logo */}
        <div className="flex items-center px-6 py-6">
          <Link to="/home" className="text-3xl font-bold text-black">
            Cabana
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2">
          {/* Main navigation */}
          <div className="space-y-1">
            <NavItem icon={Home} label="Home" path="/home" />
            <NavItem icon={Search} label="Search" path="/search" />
            <NavItem icon={TrendingUp} label="Explore" path="/explore" />
            <NavItem icon={MessageCircle} label="Messages" path="/messages" />
            <NavItem icon={Bell} label="Notifications" path="/notifications" />
            <NavItem icon={PlusSquare} label="Create" path="/create" />
            <NavItem icon={User} label="Profile" path={`/creator/${user?.user_metadata?.username || 'profile'}`} />
          </div>

          {/* Creator specific */}
          {user?.user_metadata?.role === 'creator' && (
            <div className="pt-6 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Creator Tools</div>
              <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
              <NavItem icon={DollarSign} label="Earnings" path="/earnings" />
              <NavItem icon={Crown} label="Subscribers" path="/subscribers" />
              <NavItem icon={Bookmark} label="Saved" path="/saved" />
            </div>
          )}

          {/* Admin */}
          {isAdmin && (
            <div className="pt-6 border-t border-gray-200">
              <NavItem icon={Settings} label="Admin" path="/admin" />
            </div>
          )}
        </nav>

        {/* User profile section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
              <AvatarFallback>
                {user?.user_metadata?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {user?.user_metadata?.display_name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                @{user?.user_metadata?.username || 'username'}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Individual navigation item component
  interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
}

  const NavItem = ({ icon: Icon, label, path }: NavItemProps) => {
    const active = isActive(path);
    
    return (
      <Link
        to={path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100",
          active ? "bg-gray-100 font-medium" : "text-gray-700"
        )}
      >
        <Icon className={cn("w-5 h-5", active && "fill-current")} />
        <span>{label}</span>
      </Link>
    );
  };

  if (!user) {
    return (
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/home" className="text-2xl font-bold text-black">
            Cabana
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader />
      <DesktopSidebar />
      <BottomNavigation />
    </>
  );
}