'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'muted'
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  muted: 'border-muted-foreground'
}

export default function LoadingSpinner({
  size = 'md',
  className,
  color = 'primary'
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

interface LoadingDotsProps {
  className?: string
  color?: 'primary' | 'secondary' | 'muted'
}

export function LoadingDots({ className, color = 'primary' }: LoadingDotsProps) {
  const dotColor = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted-foreground'
  }[color]

  return (
    <div className={cn('flex space-x-1', className)}>
      <div className={cn('w-2 h-2 rounded-full animate-bounce', dotColor)} style={{ animationDelay: '0ms' }} />
      <div className={cn('w-2 h-2 rounded-full animate-bounce', dotColor)} style={{ animationDelay: '150ms' }} />
      <div className={cn('w-2 h-2 rounded-full animate-bounce', dotColor)} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

interface LoadingPulseProps {
  className?: string
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <div className={cn('flex space-x-2', className)}>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  )
}
