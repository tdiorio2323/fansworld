
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  userRole?: 'creator' | 'fan';
  username?: string;
}

export function Navbar({ userRole = 'fan', username = 'User' }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const creatorNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const fanNavItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Discover' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : fanNavItems;

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
            <div className="text-3xl font-luxury font-bold text-chrome">Champagne Room</div>
          </div>
          
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-6 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item group ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {userRole === 'creator' && (
                <Link
                  to="/post/create"
                  className="btn-chrome mt-8 flex items-center justify-center gap-3 text-base"
                >
                  <Plus className="w-5 h-5" />
                  New Post
                </Link>
              )}
            </nav>
            
            <div className="px-6 pb-8 space-y-3 border-t border-border/40 pt-6 mt-6">
              <Link
                to="/notifications"
                className={`nav-item group ${isActive('/notifications') ? 'active' : ''}`}
              >
                <Bell className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Notifications</span>
              </Link>
              
              <Link
                to="/settings"
                className={`nav-item group ${isActive('/settings') ? 'active' : ''}`}
              >
                <Settings className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <Link
                to={`/creator/${username.toLowerCase()}`}
                className={`nav-item group ${isActive(`/creator/${username.toLowerCase()}`) ? 'active' : ''}`}
              >
                <Avatar className="w-7 h-7 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-18 px-6 glass-morphism border-b border-border/60 backdrop-blur-3xl">
          <div className="text-2xl font-luxury font-bold text-chrome">Champagne Room</div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <Link
                to="/settings"
                className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <Link
                to={`/creator/${username.toLowerCase()}`}
                className={`nav-item ${isActive(`/creator/${username.toLowerCase()}`) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
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
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
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