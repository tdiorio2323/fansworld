import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card } from "./card"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center py-12 px-6",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-glass-surface/5 backdrop-blur-lg rounded-lg",
        crystal: "bg-gradient-crystal/5 backdrop-blur-md rounded-lg",
        luxury: "bg-gradient-luxury/5 backdrop-blur-lg rounded-lg",
      },
      size: {
        default: "min-h-[400px]",
        sm: "min-h-[200px]",
        lg: "min-h-[600px]",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "chrome" | "glass" | "crystal" | "neon" | "luxury"
  }
}

// Crystal/Diamond Icon Component
const CrystalIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <div className="w-16 h-16 relative animate-pulse">
      {/* Main crystal shape */}
      <div className="absolute inset-0 bg-gradient-to-br from-chrome-platinum via-chrome-silver to-chrome-dark rounded-lg transform rotate-45 shadow-chrome animate-float">
        <div className="absolute inset-2 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded"></div>
      </div>
      {/* Crystal facets */}
      <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded transform rotate-12 animate-shimmer"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-chrome-highlight rounded transform -rotate-12 animate-shimmer delay-300"></div>
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-chrome-glow/20 rounded-lg blur-md animate-pulse"></div>
    </div>
  </div>
)

// Luxury Empty States
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant, size, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyStateVariants({ variant, size, className }))}
      {...props}
    >
      {/* Icon */}
      <div className="mb-6 animate-fade-in">
        {icon || <CrystalIcon />}
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-chrome-platinum via-chrome-silver to-chrome-platinum bg-clip-text text-transparent mb-3 animate-fade-up">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-chrome-platinum/70 text-lg max-w-md leading-relaxed mb-8 animate-fade-up delay-100">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <div className="animate-fade-up delay-200">
          <Button
            onClick={action.onClick}
            variant={action.variant || "chrome"}
            size="lg"
            className="min-w-[200px]"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

// Specific Empty State Components
export const NoCreatorsFound = ({ onExplore }: { onExplore: () => void }) => (
  <Card variant="glass" className="mx-auto max-w-md">
    <EmptyState
      icon={
        <div className="text-6xl mb-2 animate-bounce">✨</div>
      }
      title="No Creators Yet"
      description="Be the first to discover amazing creators and exclusive content in our luxury platform."
      action={{
        label: "Explore Creators",
        onClick: onExplore,
        variant: "chrome"
      }}
    />
  </Card>
)

export const NoMessagesFound = ({ onStartChat }: { onStartChat: () => void }) => (
  <Card variant="glass" className="mx-auto max-w-md">
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-chrome rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">💬</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-neon-blue rounded-full animate-ping"></div>
        </div>
      }
      title="No Conversations"
      description="Start your first conversation with a creator and unlock exclusive content."
      action={{
        label: "Start Chatting",
        onClick: onStartChat,
        variant: "neon"
      }}
    />
  </Card>
)

export const NoContentFound = ({ onUpload }: { onUpload: () => void }) => (
  <Card variant="crystal" className="mx-auto max-w-md">
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-holo-pink to-holo-purple rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-2xl">📸</span>
          </div>
          <div className="absolute inset-0 bg-holo-gold/20 rounded-lg animate-shimmer"></div>
        </div>
      }
      title="No Content Yet"
      description="Upload your first piece of content and start building your exclusive collection."
      action={{
        label: "Upload Content",
        onClick: onUpload,
        variant: "luxury"
      }}
    />
  </Card>
)

export const NoSearchResults = ({ query, onClear }: { query: string; onClear: () => void }) => (
  <Card variant="glass" className="mx-auto max-w-md">
    <EmptyState
      icon={
        <div className="text-6xl mb-2 opacity-60">🔍</div>
      }
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
      action={{
        label: "Clear Search",
        onClick: onClear,
        variant: "glass"
      }}
    />
  </Card>
)

export const WelcomeState = ({ userName, onGetStarted }: { userName: string; onGetStarted: () => void }) => (
  <Card variant="luxury" className="mx-auto max-w-lg">
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-champagne rounded-full flex items-center justify-center animate-pulse">
            <span className="text-3xl">👑</span>
          </div>
          <div className="absolute -inset-2 bg-chrome-glow/30 rounded-full blur-lg animate-pulse"></div>
        </div>
      }
      title={`Welcome, ${userName}!`}
      description="You've joined an exclusive community of creators and fans. Discover premium content, connect with amazing creators, and unlock unique experiences."
      action={{
        label: "Get Started",
        onClick: onGetStarted,
        variant: "chrome"
      }}
      size="lg"
    />
  </Card>
)

// Add animations to global CSS
const animations = `
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(45deg); }
  50% { transform: translateY(-10px) rotate(45deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
`

export { EmptyState, emptyStateVariants, animations }