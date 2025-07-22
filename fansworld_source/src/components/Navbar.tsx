import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Home,
  Search,
  User,
  Settings,
  MessageCircle,
  CreditCard,
  LayoutDashboard,
  Bell,
  Menu,
  X,
  LogOut,
  Plus,
  Shield,
  Crown,
  Wand2,
  Gift
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Fetch admin status
  useEffect(() => {
    if (user) {
      const fetchAdminStatus = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
        setIsAdmin(data?.is_admin || false);
      };
      fetchAdminStatus();
    }
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const creatorNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/search', icon: Search, label: 'Discover' },
    { path: '/referrals', icon: Gift, label: 'Referrals' },
    { path: '/agency', icon: Crown, label: 'Management' },
    { path: '/html-generator', icon: Wand2, label: 'HTML Generator' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const fanNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Discover' },
    { path: '/referrals', icon: Gift, label: 'Referrals' },
    { path: '/html-generator', icon: Wand2, label: 'HTML Generator' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const publicNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Discover' },
    { path: '/html-generator', icon: Wand2, label: 'HTML Generator' },
  ];

  const getNavItems = () => {
    if (!user) return publicNavItems;
    return user.user_metadata?.role === 'creator' ? creatorNavItems : fanNavItems;
  };

  const navItems = getNavItems();

  if (!user) {
    // Simplified navbar for non-authenticated users
    return (
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-18 px-6 glass-morphism border-b border-border/60 backdrop-blur-3xl">
          <div className="text-2xl font-luxury font-bold text-chrome">Cabana</div>
          
          <div className="flex items-center gap-4">
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow glass-morphism border-r border-border/60 overflow-y-auto backdrop-blur-3xl relative">
          {/* Subtle Accent Image */}
          <div className="absolute top-20 right-4 w-16 h-16 opacity-5 rotate-12">
            <img 
              src="/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png" 
              alt="" 
              className="w-full h-full object-cover rounded-xl blur-sm"
            />
          </div>
          
          <div className="flex items-center flex-shrink-0 px-6 pt-8 pb-6 relative z-10">
            <div className="text-3xl font-luxury font-bold text-chrome">Cabana</div>
          </div>
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-chrome">{user.user_metadata?.display_name || 'User'}</div>
                <div className="text-sm text-muted-foreground">@{user.user_metadata?.username || 'user'}</div>
              </div>
            </div>
            <Badge className="bg-gradient-primary text-white border-0 px-3">
              {user.user_metadata?.role === 'creator' ? 'Creator' : 'Fan'}
            </Badge>
          </div>
          
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-6 space-y-3 py-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "nav-item group",
                      isActive(item.path) && "active"
                    )}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {user.user_metadata?.role === 'creator' && (
                <Button
                  className="btn-chrome mt-8 flex items-center justify-center gap-3 text-base w-full"
                >
                  <Plus className="w-5 h-5" />
                  New Post
                </Button>
              )}
            </nav>
            
            <div className="px-6 pb-8 space-y-3 border-t border-border/40 pt-6">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={cn(
                    "nav-item group",
                    isActive('/admin') && "active"
                  )}
                >
                  <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              
              <Link
                to="/settings"
                className={cn(
                  "nav-item group",
                  isActive('/settings') && "active"
                )}
              >
                <Settings className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <Link
                to={`/creator/${user.user_metadata?.username || 'user'}`}
                className={cn(
                  "nav-item group",
                  isActive(`/creator/${user.user_metadata?.username || 'user'}`) && "active"
                )}
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start text-muted-foreground hover:text-destructive nav-item"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-18 px-6 glass-morphism border-b border-border/60 backdrop-blur-3xl">
          <div className="text-2xl font-luxury font-bold text-chrome">Cabana</div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-b border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "nav-item",
                      isActive(item.path) && "active"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className={cn(
                    "nav-item",
                    isActive('/admin') && "active"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              
              <Link
                to="/settings"
                className={cn(
                  "nav-item",
                  isActive('/settings') && "active"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <Link
                to={`/creator/${user.user_metadata?.username || 'user'}`}
                className={cn(
                  "nav-item",
                  isActive(`/creator/${user.user_metadata?.username || 'user'}`) && "active"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-muted-foreground hover:text-destructive nav-item"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-border/60 backdrop-blur-3xl">
        <div className="flex items-center justify-around py-4">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2",
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}