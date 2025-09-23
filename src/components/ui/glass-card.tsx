import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
  border?: boolean;
  gradient?: boolean;
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    children, 
    className, 
    blur = "md", 
    opacity = "medium", 
    border = true, 
    gradient = false,
    hover = true,
    ...props 
  }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md", 
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl"
    };

    const opacityClasses = {
      low: "bg-white/10 dark:bg-black/10",
      medium: "bg-white/20 dark:bg-black/20", 
      high: "bg-white/30 dark:bg-black/30"
    };

    const borderClass = border ? "border border-white/20 dark:border-white/10" : "";
    const gradientClass = gradient ? "bg-gradient-to-br from-white/25 to-white/5 dark:from-black/25 dark:to-black/5" : "";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl shadow-xl",
          blurClasses[blur],
          gradient ? gradientClass : opacityClasses[opacity],
          borderClass,
          hover && "transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/30 hover:shadow-2xl hover:scale-[1.02]",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };