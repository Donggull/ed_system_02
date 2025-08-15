import { forwardRef } from 'react'
import { inputVariants } from '@/lib/variants'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 입력 필드의 크기
   */
  size?: 'default' | 'sm' | 'lg'
  /**
   * 입력 필드의 상태
   */
  variant?: 'default' | 'error' | 'success'
  /**
   * 왼쪽에 표시할 아이콘
   */
  leftIcon?: React.ReactNode
  /**
   * 오른쪽에 표시할 아이콘
   */
  rightIcon?: React.ReactNode
  /**
   * 에러 메시지
   */
  error?: string
  /**
   * 성공 메시지
   */
  success?: string
  /**
   * 도움말 텍스트
   */
  helperText?: string
}

/**
 * Input 컴포넌트
 * 
 * 다양한 타입과 상태를 지원하는 재사용 가능한 입력 필드 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <Input 
 *   type="email" 
 *   placeholder="이메일을 입력하세요"
 *   leftIcon={<MailIcon />}
 *   error="올바른 이메일 형식이 아닙니다"
 * />
 * 
 * <Input 
 *   type="password" 
 *   placeholder="비밀번호를 입력하세요"
 *   rightIcon={<EyeIcon />}
 *   success="비밀번호가 안전합니다"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    size, 
    variant: inputVariant,
    leftIcon,
    rightIcon,
    error,
    success,
    helperText,
    disabled,
    ...props 
  }, ref) => {
    // 에러나 성공 상태에 따라 variant 결정
    const variant = error ? 'error' : success ? 'success' : inputVariant || 'default'
    const hasIcon = leftIcon || rightIcon

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ size, variant, className }),
              hasIcon && leftIcon && "pl-10",
              hasIcon && rightIcon && "pr-10",
              hasIcon && !leftIcon && "pr-10"
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? 'input-error' : 
              success ? 'input-success' : 
              helperText ? 'input-helper' : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        {/* 도움말 텍스트 */}
        {helperText && !error && !success && (
          <p 
            id="input-helper" 
            className="mt-1 text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
        
        {/* 에러 메시지 */}
        {error && (
          <p 
            id="input-error" 
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </p>
        )}
        
        {/* 성공 메시지 */}
        {success && (
          <p 
            id="input-success" 
            className="mt-1 text-xs text-success"
          >
            {success}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
