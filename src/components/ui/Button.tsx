import { forwardRef } from 'react'
import { buttonVariants } from '@/lib/variants'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /**
   * 버튼의 크기
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /**
   * 로딩 상태
   */
  loading?: boolean
  /**
   * 아이콘만 표시할지 여부
   */
  iconOnly?: boolean
}

/**
 * Button 컴포넌트
 * 
 * 다양한 스타일과 크기를 지원하는 재사용 가능한 버튼 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   클릭하세요
 * </Button>
 * 
 * <Button variant="outline" size="icon" iconOnly>
 *   <Icon />
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    iconOnly = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "cursor-wait",
          iconOnly && size === "icon" && "p-0"
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
