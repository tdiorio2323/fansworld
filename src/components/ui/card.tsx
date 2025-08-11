import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border text-card-foreground shadow-sm transition-all duration-300 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-card",
        // Luxury variants for crystal/glass aesthetic
        glass: "bg-glass-surface/10 backdrop-blur-lg border-glass-border/50 shadow-glass hover:bg-glass-surface/20 hover:shadow-xl hover:-translate-y-1",
        crystal: "bg-gradient-crystal/5 backdrop-blur-md border-chrome-platinum/20 shadow-luxury hover:shadow-glow hover:-translate-y-1",
        chrome: "bg-gradient-chrome/10 backdrop-blur-sm border-chrome-platinum/30 shadow-chrome hover:shadow-chrome-glow hover:-translate-y-1",
        luxury: "bg-gradient-luxury/5 backdrop-blur-lg border-chrome-platinum/20 shadow-luxury hover:shadow-glow hover:-translate-y-1",
        holo: "bg-gradient-holo/5 backdrop-blur-lg border-holo-pink/20 shadow-holo hover:shadow-glow hover:-translate-y-1",
        neon: "bg-black/40 backdrop-blur-lg border-neon-blue/30 shadow-neon hover:shadow-glow hover:-translate-y-1",
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, className }))}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
