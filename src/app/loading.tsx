export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground mt-4">로딩 중...</p>
        <p className="text-sm text-muted-foreground mt-2">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}
