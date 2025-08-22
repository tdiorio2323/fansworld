import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  CreditCardIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  premium?: boolean;
}

interface EnhancedSidebarProps {
  items?: NavItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  position?: 'left' | 'right';
  className?: string;
  showFooter?: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
    role?: string;
  };
}

const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
  { id: 'feed', label: 'Feed', href: '/feed', icon: <PhotoIcon className="w-5 h-5" />, badge: 'New' },
  { id: 'messages', label: 'Messages', href: '/messages', icon: <ChatBubbleLeftIcon className="w-5 h-5" />, badge: 5 },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
  { id: 'subscriptions', label: 'Subscriptions', href: '/billing', icon: <CreditCardIcon className="w-5 h-5" />, premium: true },
  { id: 'favorites', label: 'Favorites', href: '/favorites', icon: <HeartIcon className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: <BellIcon className="w-5 h-5" />, badge: 12 },
  { id: 'profile', label: 'Profile', href: '/profile', icon: <UserIcon className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <CogIcon className="w-5 h-5" /> },
];

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  items = defaultItems,
  collapsed: controlledCollapsed,
  onCollapse,
  variant = 'default',
  position = 'left',
  className,
  showFooter = true,
  userProfile
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-luxury border-purple-500/30';
      case 'chrome':
        return 'bg-gradient-chrome-luxury border-chrome-silver/50';
      case 'glass':
        return 'bg-glass-surface/80 backdrop-blur-2xl border-glass-border/30';
      default:
        return 'bg-card border-border';
    }
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <Link
          to={item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.id);
            }
          }}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
            'hover:bg-accent/10',
            isActive && 'bg-primary/10 text-primary border-l-2 border-primary',
            !isActive && 'text-muted-foreground hover:text-foreground',
            depth > 0 && 'ml-6',
            item.premium && 'text-gradient-luxury'
          )}
          style={{ paddingLeft: depth > 0 ? `${depth * 1.5 + 0.75}rem` : undefined }}
        >
          {item.icon}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 truncate"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          
          {!isCollapsed && item.badge && (
            <span className={cn(
              'px-2 py-0.5 text-xs rounded-full',
              typeof item.badge === 'number' 
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary/20 text-primary'
            )}>
              {item.badge}
            </span>
          )}
          
          {!isCollapsed && hasChildren && (
            <ChevronRightIcon 
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}

          {item.premium && (
            <SparklesIcon className="w-4 h-4 text-yellow-500" />
          )}
        </Link>

        {hasChildren && isExpanded && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1"
          >
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'relative h-full border-r flex flex-col',
        getVariantStyles(),
        position === 'right' && 'border-l border-r-0',
        className
      )}
    >
      {/* Header */}
      {userProfile && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
            )}
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium truncate">{userProfile.name}</p>
                  {userProfile.role && (
                    <p className="text-xs text-muted-foreground truncate">{userProfile.role}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map(item => renderNavItem(item))}
      </nav>

      {/* Footer */}
      {showFooter && (
        <div className="p-3 border-t border-border/50">
          <button
            onClick={handleCollapse}
            className={cn(
              'flex items-center justify-center w-full p-2 rounded-lg',
              'hover:bg-accent/10 transition-colors'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {position === 'left' ? (
              isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              isCollapsed ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </motion.aside>
  );
};