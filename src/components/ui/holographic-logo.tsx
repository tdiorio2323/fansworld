import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HolographicLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  animated?: boolean
  showText?: boolean
  variant?: "default" | "minimal" | "premium" | "neon"
}

const sizeClasses = {
  sm: "w-12 h-12 text-lg",
  md: "w-16 h-16 text-xl",
  lg: "w-24 h-24 text-2xl",
  xl: "w-32 h-32 text-3xl",
  "2xl": "w-40 h-40 text-4xl"
}

const textSizeClasses = {
  sm: "text-sm font-bold",
  md: "text-lg font-bold",
  lg: "text-xl font-bold",
  xl: "text-2xl font-bold",
  "2xl": "text-3xl font-bold"
}

const HolographicLogo = React.forwardRef<HTMLDivElement, HolographicLogoProps>(
  ({ 
    className, 
    size = "lg", 
    animated = true, 
    showText = true, 
    variant = "default",
    ...props 
  }, ref) => {
    const logoVariants = {
      default: {
        container: "bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500",
        text: "bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
      },
      minimal: {
        container: "bg-gradient-to-br from-slate-300 via-white to-slate-200",
        text: "bg-gradient-to-r from-slate-400 to-white bg-clip-text text-transparent"
      },
      premium: {
        container: "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400",
        text: "bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent"
      },
      neon: {
        container: "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400",
        text: "bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"
      }
    }

    const AnimatedLogo = () => (
      <motion.div
        className={cn(
          "relative rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl",
          sizeClasses[size],
          className
        )}
        animate={animated ? {
          background: [
            "linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)",
            "linear-gradient(90deg, #ec4899, #06b6d4, #8b5cf6)",
            "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
            "linear-gradient(180deg, #06b6d4, #8b5cf6, #ec4899)"
          ]
        } : undefined}
        transition={animated ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
        whileHover={animated ? { scale: 1.05 } : undefined}
        {...props}
      >
        {/* Holographic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Logo content */}
        <div className="relative z-10 font-bebas font-black text-white select-none">
          C
        </div>
        
        {/* Floating particles effect */}
        {animated && (
          <>
            <motion.div
              className="absolute w-1 h-1 bg-cyan-300 rounded-full"
              animate={{
                x: [0, 20, -10, 15, 0],
                y: [0, -15, 10, -5, 0],
                opacity: [0, 1, 0.5, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-purple-300 rounded-full"
              animate={{
                x: [0, -15, 20, -10, 0],
                y: [0, 10, -15, 5, 0],
                opacity: [0, 0.8, 0.3, 0.9, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-pink-300 rounded-full"
              animate={{
                x: [0, 10, -20, 5, 0],
                y: [0, -10, 5, -20, 0],
                opacity: [0, 1, 0.4, 0.8, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1
              }}
            />
          </>
        )}
      </motion.div>
    )

    const StaticLogo = () => (
      <div
        className={cn(
          "relative rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl",
          logoVariants[variant].container,
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative z-10 font-bebas font-black text-white select-none">
          C
        </div>
      </div>
    )

    return (
      <div className="flex items-center gap-3 group">
        {animated ? <AnimatedLogo /> : <StaticLogo />}
        
        {showText && (
          <motion.div
            className={cn(
              "font-bebas tracking-wider select-none",
              logoVariants[variant].text,
              textSizeClasses[size]
            )}
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0 }}
          >
            CABANA
          </motion.div>
        )}
      </div>
    )
  }
)

HolographicLogo.displayName = "HolographicLogo"

export { HolographicLogo }