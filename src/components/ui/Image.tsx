'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  placeholder?: string
  fallback?: string
  loading?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  rounded?: boolean
  onLoad?: () => void
  onError?: () => void
}

interface SkeletonProps {
  className?: string
  rounded?: boolean
}

export function ImageSkeleton({ className, rounded }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'animate-pulse bg-muted',
        rounded && 'rounded-lg',
        className
      )}
    />
  )
}

export default function Image({
  src,
  alt,
  className,
  width,
  height,
  placeholder = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Loading...',
  fallback = 'https://via.placeholder.com/400x300/fecaca/dc2626?text=Error',
  loading = false,
  objectFit = 'cover',
  rounded = false,
  onLoad,
  onError
}: ImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (loading) {
      setImageState('loading')
      setCurrentSrc(placeholder)
      return
    }

    setImageState('loading')
    setCurrentSrc(placeholder)

    const img = new window.Image()
    img.onload = () => {
      setCurrentSrc(src)
      setImageState('loaded')
      onLoad?.()
    }
    img.onerror = () => {
      setCurrentSrc(fallback)
      setImageState('error')
      onError?.()
    }
    img.src = src
  }, [src, placeholder, fallback, loading, onLoad, onError])

  if (imageState === 'loading' && loading) {
    return <ImageSkeleton className={className} rounded={rounded} />
  }

  return (
    <div className={cn('relative overflow-hidden', rounded && 'rounded-lg', className)}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          `object-${objectFit}`,
          imageState === 'loading' && 'opacity-70',
          imageState === 'error' && 'opacity-80'
        )}
        onLoad={() => {
          if (currentSrc === src) {
            setImageState('loaded')
            onLoad?.()
          }
        }}
        onError={() => {
          if (currentSrc !== fallback) {
            setCurrentSrc(fallback)
            setImageState('error')
            onError?.()
          }
        }}
      />
      
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
