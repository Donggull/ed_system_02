import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * CSS 클래스들을 결합하고 Tailwind CSS 충돌을 해결하는 유틸리티 함수
 * 
 * @param inputs - 결합할 CSS 클래스들
 * @returns 정리된 CSS 클래스 문자열
 * 
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-3", "bg-blue-500")
 * // 결과: "py-1 px-3 bg-blue-500" (px-2는 px-3으로 덮어씌워짐)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
