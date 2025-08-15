'use client'

import Image from '@/components/ui/Image'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'

interface ProfileCardProps {
  name: string
  title: string
  avatar: string
  coverImage: string
  followers: number
  following: number
  posts: number
  bio: string
  verified?: boolean
  loading?: boolean
  badges?: string[]
}

export default function ProfileCard({
  name,
  title,
  avatar,
  coverImage,
  followers,
  following,
  posts,
  bio,
  verified = false,
  loading = false,
  badges = []
}: ProfileCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card variant="elevated" padding="none" className="w-full max-w-sm mx-auto overflow-hidden">
      <CardContent>
        {/* Cover Image */}
        <div className="relative h-32 -m-4 mb-0">
          <Image
            src={coverImage}
            alt="Cover"
            loading={loading}
            className="w-full h-full"
            placeholder="https://via.placeholder.com/400x128/e2e8f0/64748b?text=Cover"
            fallback="https://via.placeholder.com/400x128/fecaca/dc2626?text=Cover+Error"
          />
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-4">
          <div className="flex items-start justify-between -mt-8 mb-4">
            <div className="relative">
              <Avatar
                src={avatar}
                alt={name}
                size="xl"
                className="ring-4 ring-background"
                showBadge={verified}
                badgeColor="blue"
              />
            </div>
            <Button variant="outline" size="sm" className="mt-6">
              팔로우
            </Button>
          </div>

          {/* User Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{name}</h3>
              {verified && (
                <Badge variant="secondary" size="sm">✓</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {badges.map((badge, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-between text-center border-t pt-3">
            <div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(posts)}
              </div>
              <div className="text-xs text-muted-foreground">게시물</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(followers)}
              </div>
              <div className="text-xs text-muted-foreground">팔로워</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(following)}
              </div>
              <div className="text-xs text-muted-foreground">팔로잉</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
