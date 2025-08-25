import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        crystal: "text-chrome-platinum",
        glass: "text-glass-tint",
        chrome: "text-chrome-platinum",
        neon: "text-neon-blue",
        luxury: "text-chrome-platinum",
      },
      size: {
        default: "h-6 w-6",
        sm: "h-4 w-4",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "crystal",
      size: "default",
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
}

// Crystal Spinner Component
const CrystalSpinner = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, text, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center space-y-2", className)}
      {...props}
    >
      <div className={cn(loadingVariants({ variant, size }))}>
        <div className="relative">
          {/* Multiple rotating crystals */}
          <div className="animate-spin">
            <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full opacity-75"></div>
          </div>
          <div className="animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }}>
            <div className="absolute inset-1 border-2 border-current border-r-transparent rounded-full opacity-50"></div>
          </div>
          <div className="animate-pulse">
            <div className="absolute inset-2 bg-current rounded-full opacity-25"></div>
          </div>
        </div>
      </div>
      {text && (
        <span className="text-sm text-chrome-platinum/80 animate-pulse font-display">
          {text}
        </span>
      )}
    </div>
  )
)
CrystalSpinner.displayName = "CrystalSpinner"

// Shimmer Skeleton Component
const ShimmerSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    lines?: number
    className?: string
  }
>(({ className, lines = 3, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse space-y-3", className)}
    {...props}
  >
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gradient-to-r from-chrome-platinum/10 via-chrome-platinum/20 to-chrome-platinum/10 rounded animate-shimmer bg-[length:200%_100%]"
        style={{ width: `${100 - (i * 10)}%` }}
      />
    ))}
  </div>
))
ShimmerSkeleton.displayName = "ShimmerSkeleton"

// Glass Card Skeleton
const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-glass-border/50 bg-glass-surface/5 backdrop-blur-lg p-6 animate-pulse",
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Avatar */}
      <div className="h-12 w-12 rounded-full bg-chrome-platinum/20 animate-shimmer"></div>
      {/* Title */}
      <div className="h-6 w-3/4 bg-chrome-platinum/20 rounded animate-shimmer"></div>
      {/* Content */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-chrome-platinum/15 rounded animate-shimmer"></div>
        <div className="h-4 w-5/6 bg-chrome-platinum/15 rounded animate-shimmer"></div>
        <div className="h-4 w-2/3 bg-chrome-platinum/15 rounded animate-shimmer"></div>
      </div>
      {/* Action buttons */}
      <div className="flex space-x-2">
        <div className="h-10 w-24 bg-chrome-platinum/20 rounded animate-shimmer"></div>
        <div className="h-10 w-20 bg-chrome-platinum/15 rounded animate-shimmer"></div>
      </div>
    </div>
  </div>
))
CardSkeleton.displayName = "CardSkeleton"

// Loading Dots
const LoadingDots = React.forwardRef<
  HTMLDivElement,
  LoadingProps
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex space-x-1", className)}
    {...props}
  >
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "rounded-full animate-bounce bg-current",
          size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : "h-3 w-3",
          loadingVariants({ variant })
        )}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
))
LoadingDots.displayName = "LoadingDots"

export { 
  CrystalSpinner, 
  ShimmerSkeleton, 
  CardSkeleton, 
  LoadingDots,
  loadingVariants 
}