'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function SkeletonLine({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-muted rounded', className)} />
  )
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-muted rounded-full', className)} />
  )
}

export function SkeletonImage({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-muted rounded-lg', className)} />
  )
}

export function ProfileCardSkeleton() {
  return (
    <Card variant="elevated" padding="none" className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* Cover Skeleton */}
        <SkeletonImage className="w-full h-32" />
        
        <div className="px-4 pb-4">
          {/* Avatar & Button */}
          <div className="flex items-start justify-between -mt-8 mb-4">
            <SkeletonAvatar className="w-16 h-16 ring-4 ring-background" />
            <SkeletonLine className="w-16 h-8 mt-6" />
          </div>

          {/* User Info */}
          <div className="space-y-2 mb-4">
            <SkeletonLine className="w-32 h-6" />
            <SkeletonLine className="w-24 h-4" />
            <SkeletonLine className="w-full h-4" />
            <SkeletonLine className="w-3/4 h-4" />
          </div>

          {/* Badges */}
          <div className="flex gap-1 mb-4">
            <SkeletonLine className="w-12 h-5" />
            <SkeletonLine className="w-16 h-5" />
            <SkeletonLine className="w-14 h-5" />
          </div>

          {/* Stats */}
          <div className="flex justify-between pt-3 border-t">
            <div className="text-center">
              <SkeletonLine className="w-8 h-6 mx-auto mb-1" />
              <SkeletonLine className="w-10 h-3 mx-auto" />
            </div>
            <div className="text-center">
              <SkeletonLine className="w-8 h-6 mx-auto mb-1" />
              <SkeletonLine className="w-10 h-3 mx-auto" />
            </div>
            <div className="text-center">
              <SkeletonLine className="w-8 h-6 mx-auto mb-1" />
              <SkeletonLine className="w-10 h-3 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card variant="elevated" padding="none" className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <SkeletonImage className="w-full h-48" />
        
        <div className="p-4">
          {/* Title & Description */}
          <div className="space-y-2 mb-3">
            <SkeletonLine className="w-full h-6" />
            <SkeletonLine className="w-3/4 h-6" />
            <SkeletonLine className="w-full h-4" />
            <SkeletonLine className="w-2/3 h-4" />
          </div>

          {/* Tags */}
          <div className="flex gap-1 mb-3">
            <SkeletonLine className="w-12 h-5" />
            <SkeletonLine className="w-16 h-5" />
            <SkeletonLine className="w-14 h-5" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <SkeletonLine className="w-20 h-4" />
            <SkeletonLine className="w-8 h-4" />
            <SkeletonLine className="w-16 h-4" />
          </div>

          {/* Price */}
          <SkeletonLine className="w-24 h-7 mb-4" />
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <SkeletonLine className="flex-1 h-8" />
            <SkeletonLine className="flex-1 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogCardSkeleton() {
  return (
    <Card variant="elevated" padding="none" className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* Cover Skeleton */}
        <SkeletonImage className="w-full h-48" />
        
        <div className="p-4">
          {/* Title & Excerpt */}
          <div className="space-y-3 mb-4">
            <SkeletonLine className="w-full h-6" />
            <SkeletonLine className="w-4/5 h-6" />
            <SkeletonLine className="w-full h-4" />
            <SkeletonLine className="w-full h-4" />
            <SkeletonLine className="w-3/4 h-4" />
          </div>

          {/* Tags */}
          <div className="flex gap-1 mb-4">
            <SkeletonLine className="w-12 h-5" />
            <SkeletonLine className="w-16 h-5" />
            <SkeletonLine className="w-10 h-5" />
          </div>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonAvatar className="w-8 h-8" />
              <div className="space-y-1">
                <SkeletonLine className="w-16 h-4" />
                <SkeletonLine className="w-12 h-3" />
              </div>
            </div>
            <div className="flex gap-3">
              <SkeletonLine className="w-8 h-3" />
              <SkeletonLine className="w-8 h-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PageLoadingProps {
  title?: string
  description?: string
}

export function PageLoading({ title = "컴포넌트 로딩 중...", description = "잠시만 기다려주세요." }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
