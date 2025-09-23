import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedGlassCardVariants = cva(
  "relative rounded-2xl border text-card-foreground transition-all duration-500 overflow-hidden group touch-manipulation backdrop-blur-xl",
  {
    variants: {
      variant: {
        // Ultra-luxury glass morphism variants
        premium: "bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/20 shadow-2xl hover:shadow-3xl hover:from-white/15 hover:border-white/30",
        luxury: "bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/5 border-purple-300/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30",
        holographic: "bg-gradient-to-br from-cyan-300/10 via-purple-300/5 to-pink-300/10 border-cyan-200/30 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-400/40",
        neon: "bg-gradient-to-br from-emerald-400/10 via-cyan-400/5 to-blue-400/10 border-emerald-300/20 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-400/40",
        frosted: "bg-white/8 backdrop-blur-2xl border-white/15 shadow-xl hover:bg-white/12 hover:border-white/25",
        diamond: "bg-gradient-to-br from-slate-100/15 via-slate-50/8 to-transparent border-slate-200/25 shadow-2xl hover:from-slate-100/20",
        obsidian: "bg-gradient-to-br from-gray-900/40 via-gray-800/20 to-black/10 border-gray-600/30 shadow-2xl hover:from-gray-900/50"
      },
      size: {
        sm: "p-4 rounded-xl",
        default: "p-6 rounded-2xl",
        lg: "p-8 rounded-3xl",
        xl: "p-10 rounded-3xl"
      },
      animation: {
        none: "",
        float: "hover:-translate-y-2",
        glow: "hover:shadow-3xl",
        pulse: "hover:scale-[1.02]",
        shimmer: "hover:bg-opacity-80"
      }
    },
    defaultVariants: {
      variant: "premium",
      size: "default",
      animation: "float"
    }
  }
)

// Shimmer effect component
const ShimmerOverlay = () => (
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
  </div>
)

// Holographic gradient background
const HolographicBackground = () => (
  <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500">
    <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-purple-500 via-pink-500 to-cyan-400 animate-spin-slow opacity-20" />
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-500/10 to-transparent" />
  </div>
)

export interface EnhancedGlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedGlassCardVariants> {
  shimmer?: boolean
  holographic?: boolean
  borderGlow?: boolean
}

const EnhancedGlassCard = React.forwardRef<HTMLDivElement, EnhancedGlassCardProps>(
  ({ className, variant, size, animation, shimmer = false, holographic = false, borderGlow = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(enhancedGlassCardVariants({ variant, size, animation, className }))}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ 
          scale: animation === "pulse" ? 1.02 : 1,
          y: animation === "float" ? -8 : 0
        }}
        {...props}
      >
        {/* Holographic background */}
        {(holographic || variant === "holographic") && <HolographicBackground />}
        
        {/* Border glow effect */}
        {borderGlow && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-300/50 via-purple-300/50 to-pink-300/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
        )}
        
        {/* Shimmer overlay */}
        {shimmer && <ShimmerOverlay />}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    )
  }
)

EnhancedGlassCard.displayName = "EnhancedGlassCard"

// Enhanced card components with luxury styling
const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 pb-4", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight tracking-tight",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/70 leading-relaxed", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("", className)} 
    {...props} 
  />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export { 
  EnhancedGlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent, 
  GlassCardFooter,
  enhancedGlassCardVariants 
}