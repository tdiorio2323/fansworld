'use client'

import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
}

export default function FrostedButton({ size = 'md', className, ...props }: Props) {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-sm'
      : size === 'lg'
      ? 'px-6 py-3 text-lg tracking-wide'
      : 'px-5 py-2'

  return (
    <button
      {...props}
      className={clsx(
        'frost rounded-full font-medium border-white/20 transition-transform duration-200',
        'hover:border-white/40 hover:scale-[1.02] active:scale-[0.99] focus-visible:ring-0',
        sizeClasses,
        className,
      )}
    />
  )
}
