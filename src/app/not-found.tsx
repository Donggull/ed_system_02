import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <div className="text-sm text-muted-foreground">
            <p>또는 다음 페이지들을 확인해보세요:</p>
            <div className="mt-2 space-x-4">
              <Link href="/" className="text-primary hover:underline">
                메인 페이지
              </Link>
              <Link href="/components" className="text-primary hover:underline">
                컴포넌트
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
