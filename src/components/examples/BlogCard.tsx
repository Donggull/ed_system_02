'use client'

import Image from '@/components/ui/Image'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'

interface BlogCardProps {
  title: string
  excerpt: string
  coverImage: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  category: string
  tags: string[]
  likes: number
  comments: number
  loading?: boolean
  featured?: boolean
}

export default function BlogCard({
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readTime,
  category,
  tags,
  likes,
  comments,
  loading = false,
  featured = false
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card 
      variant="elevated" 
      padding="none" 
      className="w-full max-w-sm mx-auto overflow-hidden" 
      hoverable
      clickable
    >
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative">
          <Image
            src={coverImage}
            alt={title}
            loading={loading}
            className="w-full h-48"
            placeholder="https://via.placeholder.com/400x192/e2e8f0/64748b?text=Blog+Cover"
            fallback="https://via.placeholder.com/400x192/fecaca/dc2626?text=Blog+Error"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" size="sm">
              {category}
            </Badge>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" size="sm">
                추천글
              </Badge>
            </div>
          )}

          {/* Read Time */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" size="sm" className="bg-black/50 text-white border-0">
              {readTime}분 읽기
            </Badge>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-4">
          <div className="space-y-3 mb-4">
            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={author.avatar}
                alt={author.name}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(publishedAt)}
                </span>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{formatNumber(likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💬</span>
                <span>{formatNumber(comments)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
