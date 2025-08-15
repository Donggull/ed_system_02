'use client'

import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'

interface ProductCardProps {
  title: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  discount?: number
  inStock: boolean
  loading?: boolean
  category: string
  tags?: string[]
}

export default function ProductCard({
  title,
  description,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  discount,
  inStock,
  loading = false,
  category,
  tags = []
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>)
    }

    return stars
  }

  return (
    <Card variant="elevated" padding="none" className="w-full max-w-sm mx-auto overflow-hidden" hoverable>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative">
          <Image
            src={image}
            alt={title}
            loading={loading}
            className="w-full h-48"
            placeholder="https://via.placeholder.com/400x192/e2e8f0/64748b?text=Product"
            fallback="https://via.placeholder.com/400x192/fecaca/dc2626?text=Product+Error"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <Badge variant="destructive" size="sm">
                -{discount}%
              </Badge>
            )}
            {!inStock && (
              <Badge variant="secondary" size="sm">
                품절
              </Badge>
            )}
          </div>

          {/* Category */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" size="sm">
              {category}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="space-y-2 mb-3">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  #{tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {renderStars(rating)}
            </div>
            <span className="text-sm font-medium text-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount.toLocaleString()}개 리뷰)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            disabled={!inStock}
          >
            장바구니
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            disabled={!inStock}
          >
            {inStock ? '구매하기' : '품절'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
