'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

const variants = {
  default: 'bg-card border border-border',
  elevated: 'bg-card shadow-md border-0',
  outlined: 'bg-transparent border-2 border-border'
}

const paddings = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg transition-all duration-200',
        variants[variant],
        paddings[padding],
        hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
        clickable && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('pb-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('pt-3', className)}>
      {children}
    </div>
  )
}
