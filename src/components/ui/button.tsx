import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation select-none cursor-pointer active:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Luxury crystal/glass variants
        chrome: "bg-gradient-chrome text-white shadow-chrome hover:shadow-chrome-glow hover:scale-105 active:scale-95 backdrop-blur-sm border border-chrome-platinum/20",
        glass: "bg-glass-surface/10 backdrop-blur-lg border border-glass-border text-chrome-platinum hover:bg-glass-surface/20 hover:shadow-glass hover:scale-105 active:scale-95",
        crystal: "bg-gradient-crystal text-white shadow-luxury hover:shadow-glow hover:scale-105 active:scale-95 backdrop-blur-sm",
        neon: "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon hover:shadow-glow hover:scale-105 active:scale-95",
        luxury: "bg-gradient-luxury text-white shadow-luxury hover:shadow-glow hover:scale-105 active:scale-95 backdrop-blur-sm",
        holo: "bg-gradient-holo text-white shadow-holo hover:shadow-glow hover:scale-105 active:scale-95 backdrop-blur-sm",
      },
      size: {
        default: "h-12 px-4 py-3 min-h-[48px]",
        sm: "h-10 rounded-md px-3 min-h-[40px]",
        lg: "h-14 rounded-md px-8 min-h-[56px] text-base",
        xl: "h-16 rounded-lg px-12 text-lg min-h-[64px]",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
