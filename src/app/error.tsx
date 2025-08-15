'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">문제가 발생했습니다</h1>
        <p className="text-muted-foreground mb-6">
          예상치 못한 오류가 발생했습니다. 페이지를 다시 로드해보세요.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
          <div className="text-sm text-muted-foreground">
            <p>문제가 계속 발생하면 페이지를 새로고침하거나</p>
            <p>나중에 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
