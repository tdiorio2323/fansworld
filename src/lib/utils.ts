import { badgeVariants } from "@/components/ui/badge-variants"
import type { VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export type BadgeVariantsProps = VariantProps<typeof badgeVariants>
