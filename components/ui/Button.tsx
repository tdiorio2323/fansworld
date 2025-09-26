"use client"

import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'btn-reset inline-flex items-center justify-center rounded-full transition hover-lift disabled:opacity-60 disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2 text-base',
  lg: 'px-6 py-3 text-lg tracking-wide',
}

const variants: Record<Variant, string> = {
  primary: 'frost border-white/25 hover:border-white/45 shadow-soft text-white',
  secondary: 'glass border-white/15 hover:border-white/35 shadow-glass text-white/90',
  ghost: 'bg-transparent border border-white/20 hover:border-white/40 text-white',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
}
