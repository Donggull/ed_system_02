'use client'

import { DesignSystemProvider } from '@/contexts/DesignSystemContext'
import ComponentPreview from '@/components/design-system/ComponentPreview'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { defaultTheme } from '@/contexts/DesignSystemContext'

function TestSettingsContent() {
  const { theme, componentSettings } = useDesignSystem()
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            컴포넌트 설정 테스트
          </h1>
          <p className="text-lg text-muted-foreground">
            각 컴포넌트의 설정을 실시간으로 변경하고 미리보기에서 확인해보세요.
          </p>
        </div>

        {/* 현재 설정 상태 표시 */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">현재 컴포넌트 설정 상태</h3>
          <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
            {JSON.stringify(componentSettings, null, 2)}
          </pre>
        </div>

        {/* 컴포넌트별 미리보기 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Button 컴포넌트</h2>
            <ComponentPreview type="button" theme={theme} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Input 컴포넌트</h2>
            <ComponentPreview type="input" theme={theme} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Badge 컴포넌트</h2>
            <ComponentPreview type="badge" theme={theme} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Card 컴포넌트</h2>
            <ComponentPreview type="card" theme={theme} />
          </div>
        </div>

        {/* 테스트 지침 */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">테스트 방법</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>각 컴포넌트의 "세부 설정" 섹션을 열어보세요</li>
            <li>설정값을 변경해보세요 (크기, 변형, 상태 등)</li>
            <li>변경사항이 즉시 미리보기에 반영되는지 확인하세요</li>
            <li>여러 컴포넌트의 설정을 동시에 변경해보세요</li>
            <li>위의 "현재 컴포넌트 설정 상태"가 실시간으로 업데이트되는지 확인하세요</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
            <strong>예상 동작:</strong>
            <ul className="list-disc list-inside mt-2">
              <li>Button: 크기, 변형, 로딩 상태, 비활성화 설정 변경 가능</li>
              <li>Input: 크기, 타입, 플레이스홀더, 에러/성공 메시지 설정 가능</li>
              <li>Badge: 변형, 크기, 클릭 가능 여부 설정 변경 가능</li>
              <li>Card: 변형, 패딩, 헤더/푸터 표시 설정 변경 가능</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestSettingsPage() {
  return (
    <DesignSystemProvider>
      <TestSettingsContent />
    </DesignSystemProvider>
  )
}