import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const frostedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium leading-none tracking-tight min-h-[44px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md border shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-white/20 border-white/30 text-foreground hover:bg-white/30 hover:border-white/40 dark:bg-black/20 dark:border-white/20 dark:hover:bg-black/30",
        primary: "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30 hover:border-blue-400/60 dark:text-blue-200",
        success: "bg-green-500/20 border-green-400/40 text-green-100 hover:bg-green-500/30 hover:border-green-400/60 dark:text-green-200",
        warning: "bg-yellow-500/20 border-yellow-400/40 text-yellow-100 hover:bg-yellow-500/30 hover:border-yellow-400/60 dark:text-yellow-200",
        danger: "bg-red-500/20 border-red-400/40 text-red-100 hover:bg-red-500/30 hover:border-red-400/60 dark:text-red-200",
        ghost: "bg-transparent border-white/20 text-foreground hover:bg-white/10 hover:border-white/30 dark:border-white/10",
        luxury: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40 text-purple-100 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/60 dark:text-purple-200",
        holographic: "bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 border-cyan-300/40 text-cyan-100 hover:from-cyan-400/30 hover:via-purple-400/30 hover:to-pink-400/30 hover:border-cyan-300/60",
        neon: "bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-500/25",
        premium: "bg-gradient-to-r from-slate-100/20 to-white/15 border-white/30 text-white hover:from-slate-100/30 hover:to-white/25 hover:border-white/40",
        diamond: "bg-gradient-to-br from-slate-200/15 via-white/10 to-slate-100/15 border-slate-300/25 text-slate-100 hover:from-slate-200/25 hover:border-slate-300/40"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10"
      },
      glow: {
        none: "",
        subtle: "shadow-lg shadow-current/20",
        medium: "shadow-xl shadow-current/30",
        strong: "shadow-2xl shadow-current/40",
        ultra: "shadow-3xl shadow-current/50 hover:shadow-current/60",
        rainbow: "shadow-2xl shadow-purple-500/30 hover:shadow-cyan-500/40 transition-shadow duration-500"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "subtle"
    }
  }
);

export interface FrostedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof frostedButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FrostedButton = React.forwardRef<HTMLButtonElement, FrostedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow, 
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        className={cn(frostedButtonVariants({ variant, size, glow, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

FrostedButton.displayName = "FrostedButton";

export { FrostedButton, frostedButtonVariants };