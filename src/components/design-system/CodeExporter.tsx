'use client'

import React, { useState, useMemo } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { CodeGenerator } from '@/lib/codeGenerator'
import { ExportUtils } from '@/lib/exportUtils'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { GitHubSetup } from './GitHubSetup'

interface CodeExporterProps {
  className?: string
}

export const CodeExporter: React.FC<CodeExporterProps> = ({ className }) => {
  const { theme, selectedComponents } = useDesignSystem()
  const [activeTab, setActiveTab] = useState<'preview' | 'export' | 'documentation'>('preview')
  const [selectedFormat, setSelectedFormat] = useState<'react' | 'vue' | 'html' | 'typescript' | 'css' | 'storybook'>('react')
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null)
  const [githubConfig, setGitHubConfig] = useState<{ token: string; owner: string; repo: string } | null>(null)
  const [showGitHubSetup, setShowGitHubSetup] = useState(false)
  // 내보내기 방식 선택을 위한 상태 추가
  const [exportMethods, setExportMethods] = useState<{
    zip: boolean
    github: boolean
    npm: boolean
  }>({
    zip: false,
    github: false,
    npm: false
  })
  // 로딩 상태 관리
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<string>('')
  // 내보내기 결과 상태
  const [exportResults, setExportResults] = useState<{
    zip?: string
    github?: string
    npm?: string
  }>({})

  // 코드 생성기 및 내보내기 유틸리티 초기화
  const codeGenerator = useMemo(() => new CodeGenerator(theme, selectedComponents), [theme, selectedComponents])
  const generatedCode = useMemo(() => codeGenerator.generateFullCode(), [codeGenerator])
  const components = useMemo(() => codeGenerator.generateAllComponents(), [codeGenerator])
  const exportUtils = useMemo(() => new ExportUtils(theme, components, generatedCode), [theme, components, generatedCode])

  // 코드 복사 함수
  const copyToClipboard = async (text: string, componentName?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (componentName) {
        setCopiedComponent(componentName)
        setTimeout(() => setCopiedComponent(null), 2000)
      }
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
    }
  }

  // 전체 코드 복사
  const copyFullCode = () => {
    copyToClipboard(generatedCode[selectedFormat])
  }

  // 컴포넌트별 코드 복사
  const copyComponentCode = (componentName: string) => {
    const code = exportUtils.copyComponentCode(componentName, selectedFormat)
    copyToClipboard(code, componentName)
  }

  // GitHub 저장소 생성 (개선된 버전)
  const createGitHubRepo = async () => {
    if (!githubConfig) {
      setShowGitHubSetup(true)
      return
    }

    setIsExporting(true)
    setExportProgress('GitHub 저장소 생성 중...')
    
    try {
      // GitHub Utils 동적 import
      const { GitHubUtils } = await import('@/lib/githubUtils')
      
      const githubUtils = new GitHubUtils({
        token: githubConfig.token,
        owner: githubConfig.owner,
        repo: githubConfig.repo
      }, exportUtils)

      setExportProgress('저장소 생성 및 파일 업로드 중...')
      
      const repoUrl = await githubUtils.pushDesignSystem(
        githubConfig.repo,
        '디자인 시스템 컴포넌트 라이브러리 - Claude Code로 생성',
        false
      )
      
      setExportResults(prev => ({ ...prev, github: repoUrl }))
      setExportProgress('GitHub 저장소 생성 완료!')
      
      // 성공 알림
      setTimeout(() => {
        setExportProgress('')
      }, 3000)
      
    } catch (error) {
      console.error('GitHub 저장소 생성 오류:', error)
      setExportProgress(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      
      setTimeout(() => {
        setExportProgress('')
      }, 5000)
    } finally {
      setIsExporting(false)
    }
  }

  // NPM 패키지 생성
  const createNPMPackage = () => {
    const packageJson = exportUtils.generatePackageJson()
    const content = JSON.stringify(packageJson, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'package.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ZIP 파일 다운로드 (개선된 버전)
  const downloadZip = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    setExportProgress('ZIP 파일 생성 중...')
    
    try {
      setExportProgress('파일들을 압축하는 중...')
      const blob = await exportUtils.createZipFile()
      
      setExportProgress('다운로드 준비 중...')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `design-system-${new Date().toISOString().split('T')[0]}.zip`
      a.click()
      
      setExportResults(prev => ({ ...prev, zip: a.download }))
      setExportProgress('ZIP 파일 다운로드 완료!')
      
      // 메모리 정리
      setTimeout(() => {
        URL.revokeObjectURL(url)
        setExportProgress('')
      }, 3000)
      
    } catch (error) {
      console.error('ZIP 파일 생성 오류:', error)
      setExportProgress(`ZIP 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      
      setTimeout(() => {
        setExportProgress('')
      }, 5000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`space-y-8 p-6 ${className}`}>
      {/* 헤더 섹션 */}
      <div className="glass-card p-6 rounded-2xl animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
          <h2 className="text-2xl font-bold text-gradient">코드 내보내기</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          생성된 디자인 시스템을 다양한 형태로 내보내고 공유하세요 ✨
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="glass-card p-2 rounded-xl animate-slide-in">
        <div className="flex space-x-2">
          {[
            { id: 'preview', label: '코드 미리보기', icon: '👁️' },
            { id: 'export', label: '내보내기', icon: '📦' },
            { id: 'documentation', label: '문서화', icon: '📚' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 코드 미리보기 탭 */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-fade-in">
          {/* 코드 형식 선택 */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚙️</span>
                <label htmlFor="code-format" className="text-base font-semibold">
                  코드 형식 선택
                </label>
              </div>
            </div>
            <select
              id="code-format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="input-modern w-full px-4 py-3 text-sm font-medium bg-background/80 hover-lift cursor-pointer"
            >
              <option value="react">⚛️ React Components</option>
              <option value="vue">🟢 Vue Components</option>
              <option value="html">🌐 HTML + CSS</option>
              <option value="typescript">📘 TypeScript Definitions</option>
              <option value="css">🎨 CSS Variables</option>
              <option value="storybook">📖 Storybook Stories</option>
            </select>
          </div>

          {/* 전체 코드 미리보기 */}
          <div className="glass-card p-6 rounded-xl border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📄</span>
                <h3 className="text-lg font-bold text-gradient">전체 코드</h3>
              </div>
              <Button 
                onClick={copyFullCode} 
                size="sm" 
                className="btn-primary hover-lift"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                전체 복사
              </Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border border-border/20">
              <pre className="code-editor text-xs overflow-auto max-h-96 custom-scrollbar">
                <code>{generatedCode[selectedFormat]}</code>
              </pre>
            </div>
          </div>

          {/* 컴포넌트별 코드 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">🧩</span>
              <h3 className="text-lg font-bold text-gradient">컴포넌트별 코드</h3>
            </div>
            {components.map((component, index) => (
              <div 
                key={component.name} 
                className="glass-card p-4 rounded-xl border border-border/30 hover-lift animate-scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                    <h4 className="font-semibold text-foreground">{component.name}</h4>
                    <Badge variant="outline" size="sm">
                      {selectedFormat.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => copyComponentCode(component.name)}
                    size="sm"
                    className={`hover-lift transition-all duration-200 ${
                      copiedComponent === component.name 
                        ? 'bg-success/10 text-success border-success/30' 
                        : 'btn-secondary'
                    }`}
                  >
                    {copiedComponent === component.name ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        복사됨!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        복사
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/20">
                  <pre className="code-editor text-xs overflow-auto max-h-32 custom-scrollbar">
                    <code>{component[selectedFormat]}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 내보내기 탭 */}
      {activeTab === 'export' && (
        <div className="space-y-6 animate-fade-in">
          {/* 진행 상태 표시 */}
          {(isExporting || exportProgress) && (
            <div className="glass-card p-6 rounded-xl border border-border/30 animate-scale-in">
              <div className="flex items-center space-x-3 mb-3">
                {isExporting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary/30 border-t-primary"></div>
                )}
                <span className={`font-medium ${
                  isExporting 
                    ? 'text-primary' 
                    : exportProgress.includes('완료') 
                      ? 'text-success' 
                      : 'text-destructive'
                }`}>
                  {exportProgress}
                </span>
              </div>
              {isExporting && (
                <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-primary h-3 rounded-full animate-pulse loading-shimmer" style={{ width: '60%' }}></div>
                </div>
              )}
            </div>
          )}
          
          {/* 내보내기 결과 표시 */}
          {Object.keys(exportResults).length > 0 && (
            <div className="glass-card p-6 rounded-xl border border-success/30 bg-success/5 animate-scale-in">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">🎉</span>
                <h3 className="text-lg font-bold text-success">내보내기 완료!</h3>
              </div>
              <div className="space-y-3">
                {exportResults.zip && (
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📦</span>
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">ZIP</Badge>
                        <p className="text-sm text-muted-foreground">{exportResults.zip}</p>
                      </div>
                    </div>
                  </div>
                )}
                {exportResults.github && (
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🐙</span>
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">GitHub</Badge>
                        <a 
                          href={exportResults.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline font-medium hover-lift inline-block"
                        >
                          저장소 바로가기 →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {exportResults.npm && (
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">NPM</Badge>
                        <p className="text-sm text-muted-foreground">{exportResults.npm}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 내보내기 방식 선택 */}
          <div className="glass-card p-6 rounded-xl border border-border/30">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">⚙️</span>
              <h3 className="text-lg font-bold text-gradient">내보내기 방식 선택</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-all duration-200 cursor-pointer hover-lift">
                <input
                  type="checkbox"
                  id="export-zip"
                  checked={exportMethods.zip}
                  onChange={(e) => setExportMethods(prev => ({ ...prev, zip: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📦</span>
                  <div>
                    <span className="font-medium">ZIP 파일로 다운로드</span>
                    <p className="text-xs text-muted-foreground">완전한 프로젝트 구조를 압축 파일로</p>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-all duration-200 cursor-pointer hover-lift">
                <input
                  type="checkbox"
                  id="export-github"
                  checked={exportMethods.github}
                  onChange={(e) => setExportMethods(prev => ({ ...prev, github: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🐙</span>
                  <div>
                    <span className="font-medium">GitHub 저장소 생성</span>
                    <p className="text-xs text-muted-foreground">바로 배포 가능한 저장소로 업로드</p>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-all duration-200 cursor-pointer hover-lift">
                <input
                  type="checkbox"
                  id="export-npm"
                  checked={exportMethods.npm}
                  onChange={(e) => setExportMethods(prev => ({ ...prev, npm: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📋</span>
                  <div>
                    <span className="font-medium">NPM 패키지 생성</span>
                    <p className="text-xs text-muted-foreground">NPM에 게시할 수 있는 패키지 구조</p>
                  </div>
                </div>
              </label>
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg border border-border/20">
              💡 원하는 내보내기 방식을 선택한 후 아래 버튼을 클릭하세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ZIP 다운로드 */}
            {exportMethods.zip && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ZIP 파일</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    전체 디자인 시스템을 ZIP 파일로 다운로드합니다.
                  </p>
                  <Button 
                    onClick={downloadZip} 
                    className="w-full" 
                    disabled={isExporting}
                  >
                    {isExporting && exportProgress.includes('ZIP') ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        생성 중...
                      </>
                    ) : (
                      'ZIP 다운로드'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* GitHub 저장소 */}
            {exportMethods.github && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">GitHub 저장소</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    GitHub에 새로운 저장소를 생성합니다.
                  </p>
                  {githubConfig ? (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">연결됨:</span> {githubConfig.owner}/{githubConfig.repo}
                      </div>
                      <Button 
                        onClick={createGitHubRepo} 
                        className="w-full"
                        disabled={isExporting}
                      >
                        {isExporting && exportProgress.includes('GitHub') ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            생성 중...
                          </>
                        ) : (
                          '저장소 생성'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowGitHubSetup(true)} className="w-full">
                      GitHub 연동 설정
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* NPM 패키지 */}
            {exportMethods.npm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">NPM 패키지</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    NPM 패키지용 파일들을 생성합니다.
                  </p>
                  <Button onClick={createNPMPackage} className="w-full">
                    package.json 생성
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 선택된 내보내기 방식이 없을 때 안내 메시지 */}
          {!exportMethods.zip && !exportMethods.github && !exportMethods.npm && (
            <Card>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    위에서 원하는 내보내기 방식을 선택해주세요.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 선택된 컴포넌트 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">선택된 컴포넌트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {components.map(component => (
                  <Badge key={component.name} variant="secondary">
                    {component.name}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                총 {components.length}개의 컴포넌트가 선택되었습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 문서화 탭 */}
      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">자동 생성된 문서</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* README */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">README.md</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                  <code>{exportUtils.generateREADME()}</code>
                </pre>
                <Button 
                  onClick={() => copyToClipboard(exportUtils.generateREADME())}
                  className="mt-2"
                  size="sm"
                >
                  README 복사
                </Button>
              </CardContent>
            </Card>

            {/* CHANGELOG */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CHANGELOG.md</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                  <code>{exportUtils.generateCHANGELOG()}</code>
                </pre>
                <Button 
                  onClick={() => copyToClipboard(exportUtils.generateCHANGELOG())}
                  className="mt-2"
                  size="sm"
                >
                  CHANGELOG 복사
                </Button>
              </CardContent>
            </Card>

            {/* API Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API.md (API 문서)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                  <code>{exportUtils.generateAPIDocumentation()}</code>
                </pre>
                <Button 
                  onClick={() => copyToClipboard(exportUtils.generateAPIDocumentation())}
                  className="mt-2"
                  size="sm"
                >
                  API 문서 복사
                </Button>
              </CardContent>
            </Card>

            {/* Installation Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">INSTALLATION.md (설치 가이드)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
                  <code>{exportUtils.generateInstallationGuide()}</code>
                </pre>
                <Button 
                  onClick={() => copyToClipboard(exportUtils.generateInstallationGuide())}
                  className="mt-2"
                  size="sm"
                >
                  설치 가이드 복사
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 컴포넌트별 문서 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">컴포넌트 문서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {components.map(component => (
                  <div key={component.name} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{component.name} 컴포넌트</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-muted-foreground mb-1">Props</h5>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                          <code>{component.typescript}</code>
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-medium text-muted-foreground mb-1">사용 예시</h5>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                          <code>{component.react}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GitHub 설정 모달 */}
      {showGitHubSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <GitHubSetup
              onSetup={(config) => {
                setGitHubConfig(config)
                setShowGitHubSetup(false)
              }}
            />
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowGitHubSetup(false)}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 컴포넌트 설명 가져오기
function getComponentDescription(name: string): string {
  const descriptions = {
    'Button': '사용자 인터랙션을 위한 기본 버튼 컴포넌트입니다.',
    'Input': '텍스트 입력을 받는 폼 컴포넌트입니다.',
    'Card': '콘텐츠를 그룹화하는 컨테이너 컴포넌트입니다.',
    'Badge': '상태나 라벨을 표시하는 작은 컴포넌트입니다.',
    'Avatar': '사용자 프로필 이미지나 이니셜을 표시합니다.',
    'Typography': '일관된 텍스트 스타일링을 위한 컴포넌트입니다.'
  }
  
  return descriptions[name as keyof typeof descriptions] || '재사용 가능한 UI 컴포넌트입니다.'
}
