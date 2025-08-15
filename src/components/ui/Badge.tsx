import { forwardRef } from 'react'
import { badgeVariants } from '@/lib/variants'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 배지의 시각적 스타일
   */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  /**
   * 배지의 크기
   */
  size?: 'default' | 'sm' | 'lg'
  /**
   * 배지에 표시할 아이콘
   */
  icon?: React.ReactNode
  /**
   * 배지의 색상 (커스텀)
   */
  color?: string
  /**
   * 배지가 클릭 가능한지 여부
   */
  clickable?: boolean
}

/**
 * Badge 컴포넌트
 * 
 * 상태 표시, 라벨링, 카테고리 구분 등에 사용되는 배지 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <Badge variant="default">New</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline" icon={<StarIcon />}>Featured</Badge>
 * <Badge clickable onClick={handleClick}>Clickable</Badge>
 * ```
 */
const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size = 'default',
    icon,
    color,
    clickable = false,
    children,
    ...props 
  }, ref) => {
    const Component = clickable ? 'button' : 'div'
    
    return (
      <Component
        ref={ref}
        className={cn(
          badgeVariants({ variant, className }),
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'lg' && 'px-3 py-1 text-sm',
          clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          color && `bg-${color}-100 text-${color}-800 border-${color}-200`
        )}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {icon && (
          <span className="mr-1 inline-flex items-center">
            {icon}
          </span>
        )}
        {children}
      </Component>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
