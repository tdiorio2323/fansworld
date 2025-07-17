<<<<<<< HEAD
import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

const colorClasses: Record<BadgeProps['color'], string> = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
  success: 'bg-green-500 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  className = '',
}) => {
  return (
	<span
	  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[color]} ${className}`}
	>
	  {children}
	</span>
  );
};

export default Badge;
=======
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
>>>>>>> 2f22c6f24cfd8089a834064e240f68ea540b4e52

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }