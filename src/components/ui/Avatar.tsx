'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
  showBadge?: boolean
  badgeColor?: 'green' | 'red' | 'yellow' | 'blue'
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
}

const badgeColors = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500'
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
  showBadge,
  badgeColor = 'green'
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayFallback = fallback || getInitials(alt)

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-muted flex items-center justify-center font-medium text-muted-foreground',
          sizeClasses[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{displayFallback}</span>
        )}
      </div>
      
      {showBadge && (
        <div
          className={cn(
            'absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-background',
            badgeColors[badgeColor]
          )}
        />
      )}
    </div>
  )
}
