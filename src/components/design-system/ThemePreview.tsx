'use client'

import { useState } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import AdvancedThemePreview from '@/components/preview/AdvancedThemePreview'
import { getThemeColor, applyOpacity, getThemeGradient, isColorDark, getContrastColor } from '@/lib/themeUtils'

interface ThemePreviewProps {
  className?: string
}

export default function ThemePreview({ className }: ThemePreviewProps) {
  const { theme } = useDesignSystem()
  const [activePreview, setActivePreview] = useState<'components' | 'dashboard'>('components')

  // 테마 색상 추출
  const primaryColor = getThemeColor(theme, 'primary', '#8b5cf6')
  const secondaryColor = getThemeColor(theme, 'secondary', '#64748b')
  const backgroundColor = getThemeColor(theme, 'background', '#ffffff')
  const foregroundColor = getThemeColor(theme, 'foreground', '#0f172a')
  const mutedColor = getThemeColor(theme, 'mutedForeground', '#64748b')
  const borderColor = getThemeColor(theme, 'border', '#e2e8f0')
  const successColor = getThemeColor(theme, 'success', '#22c55e')
  const warningColor = '#f59e0b'
  const destructiveColor = getThemeColor(theme, 'destructive', '#ef4444')
  
  // 대비되는 텍스트 색상
  const primaryTextColor = getContrastColor(primaryColor)
  const successTextColor = getContrastColor(successColor)

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 헤더 */}
      <div 
        className="glass-card p-6 rounded-2xl animate-fade-in"
        style={{ 
          borderColor: applyOpacity(borderColor, 0.3),
          backgroundColor: applyOpacity(backgroundColor, 0.8)
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)` }}
              ></div>
              <h2 
                className="text-2xl font-bold"
                style={{ 
                  color: primaryColor,
                  textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}`
                }}
              >
                테마 미리보기
              </h2>
            </div>
            <p className="text-lg" style={{ color: mutedColor }}>
              현재 설정된 테마가 실제 컴포넌트에 어떻게 적용되는지 확인하세요 🎨
            </p>
          </div>
          
          {/* 미리보기 모드 선택 */}
          <div 
            className="glass-card p-2 rounded-xl"
            style={{ 
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.6)
            }}
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setActivePreview('components')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                style={
                  activePreview === 'components'
                    ? {
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.9)} 100%)`,
                        color: primaryTextColor,
                        boxShadow: `0 4px 20px ${applyOpacity(primaryColor, 0.3)}`
                      }
                    : {
                        color: mutedColor,
                        backgroundColor: 'transparent'
                      }
                }
                onMouseEnter={(e) => {
                  if (activePreview !== 'components') {
                    e.currentTarget.style.color = foregroundColor
                    e.currentTarget.style.backgroundColor = applyOpacity(borderColor, 0.5)
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePreview !== 'components') {
                    e.currentTarget.style.color = mutedColor
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span>🧩</span>
                <span>컴포넌트</span>
              </button>
              <button
                onClick={() => setActivePreview('dashboard')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                style={
                  activePreview === 'dashboard'
                    ? {
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.9)} 100%)`,
                        color: primaryTextColor,
                        boxShadow: `0 4px 20px ${applyOpacity(primaryColor, 0.3)}`
                      }
                    : {
                        color: mutedColor,
                        backgroundColor: 'transparent'
                      }
                }
                onMouseEnter={(e) => {
                  if (activePreview !== 'dashboard') {
                    e.currentTarget.style.color = foregroundColor
                    e.currentTarget.style.backgroundColor = applyOpacity(borderColor, 0.5)
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePreview !== 'dashboard') {
                    e.currentTarget.style.color = mutedColor
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span>📊</span>
                <span>대시보드</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 미리보기 내용 */}
      {activePreview === 'dashboard' ? (
        <AdvancedThemePreview theme={theme} />
      ) : (
        <div className="space-y-8">

      {/* Cards 미리보기 */}
      <div className="animate-slide-in">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-lg">🃏</span>
          <h3 
            className="text-xl font-bold"
            style={{ 
              color: primaryColor,
              textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}`
            }}
          >
            Cards
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 기본 카드 */}
          <div 
            className="glass-card p-6 rounded-xl hover-lift"
            style={{ 
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.8)
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold" style={{ color: foregroundColor }}>프로젝트 진행률</h4>
              <Badge 
                variant="secondary" 
                size="sm" 
                style={{ 
                  backgroundColor: applyOpacity(secondaryColor, 0.1),
                  color: secondaryColor,
                  borderColor: applyOpacity(secondaryColor, 0.3)
                }}
              >
                진행중
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: mutedColor }}>완료</span>
                <span className="font-medium" style={{ color: foregroundColor }}>68%</span>
              </div>
              <div 
                className="w-full rounded-full h-2"
                style={{ backgroundColor: applyOpacity(borderColor, 0.3) }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: '68%',
                    background: `linear-gradient(90deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div 
            className="glass-card p-6 rounded-xl hover-lift"
            style={{ 
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.8)
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)` 
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke={primaryTextColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: mutedColor }}>총 방문자</p>
                <p className="text-2xl font-bold" style={{ color: primaryColor }}>12,843</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span style={{ color: successColor }}>↗ +12.5%</span>
              <span style={{ color: mutedColor }}>지난주 대비</span>
            </div>
          </div>

          {/* 사용자 카드 */}
          <div 
            className="glass-card p-6 rounded-xl hover-lift"
            style={{ 
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.8)
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)` 
                }}
              >
                <span className="font-semibold" style={{ color: primaryTextColor }}>김</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: foregroundColor }}>김개발</h4>
                <p className="text-sm" style={{ color: mutedColor }}>프론트엔드 개발자</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.9)} 100%)`,
                  color: primaryTextColor,
                  border: 'none'
                }}
              >
                팔로우
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="px-3"
                style={{ 
                  borderColor: borderColor,
                  color: foregroundColor,
                  backgroundColor: 'transparent'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard 미리보기 */}
      <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-lg">📊</span>
          <h3 className="text-xl font-bold text-gradient">Dashboard</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 차트 영역 */}
          <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-border/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-bold text-foreground">매출 분석</h4>
                <p className="text-sm text-muted-foreground">최근 6개월 데이터</p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="outline" size="sm">월간</Badge>
                <Badge variant="secondary" size="sm">주간</Badge>
              </div>
            </div>
            
            {/* 가짜 차트 */}
            <div className="h-64 bg-muted/20 rounded-lg border border-border/20 relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-4">
                {[65, 42, 78, 56, 89, 67].map((height, i) => (
                  <div
                    key={i}
                    className="bg-gradient-primary rounded-t opacity-70 hover:opacity-100 transition-all duration-300 hover-lift cursor-pointer"
                    style={{
                      height: `${height}%`,
                      width: '12%',
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                1월 - 6월
              </div>
            </div>
          </div>

          {/* 사이드 위젯들 */}
          <div className="space-y-6">
            {/* KPI 카드들 */}
            {[
              { label: '총 매출', value: '₩2,340만', change: '+15.3%', trend: 'up' },
              { label: '신규 고객', value: '1,234명', change: '+8.7%', trend: 'up' },
              { label: '전환율', value: '3.24%', change: '-2.1%', trend: 'down' }
            ].map((kpi, i) => (
              <div 
                key={i} 
                className="glass-card p-4 rounded-xl border border-border/30 hover-lift animate-scale-in"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <span className={`text-xs ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {kpi.trend === 'up' ? '↗' : '↘'} {kpi.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-gradient">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mail 미리보기 */}
      <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-lg">✉️</span>
          <h3 className="text-xl font-bold text-gradient">Mail</h3>
        </div>
        
        <div className="glass-card rounded-xl border border-border/30 overflow-hidden">
          <div className="flex">
            {/* 메일 리스트 */}
            <div className="w-1/3 border-r border-border/30">
              <div className="p-4 border-b border-border/30">
                <h4 className="font-semibold text-foreground">받은편지함</h4>
                <p className="text-sm text-muted-foreground">3개의 새 메시지</p>
              </div>
              <div className="space-y-0">
                {[
                  { sender: '김매니저', subject: '프로젝트 진행 상황', time: '2분 전', unread: true },
                  { sender: '이디자이너', subject: 'UI/UX 검토 요청', time: '1시간 전', unread: true },
                  { sender: '박개발자', subject: '코드 리뷰 완료', time: '3시간 전', unread: false }
                ].map((mail, i) => (
                  <div 
                    key={i}
                    className={`p-4 border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-all duration-200 ${
                      mail.unread ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${mail.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {mail.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">{mail.time}</span>
                    </div>
                    <p className={`text-sm truncate ${mail.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {mail.subject}
                    </p>
                    {mail.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 메일 내용 */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-foreground">프로젝트 진행 상황</h4>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      답장
                    </Button>
                    <Button size="sm" variant="outline">
                      전달
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>김매니저</span>
                  <span>•</span>
                  <span>manager@example.com</span>
                  <span>•</span>
                  <span>2분 전</span>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  안녕하세요!<br/><br/>
                  이번 주 프로젝트 진행 상황을 공유드립니다.<br/>
                  디자인 시스템 구축이 거의 완료되어 가고 있으며, 
                  예상보다 빠른 속도로 진행되고 있어 기쁩니다.<br/><br/>
                  다음 주까지는 모든 컴포넌트가 완성될 예정입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 색상 팔레트 미리보기 */}
      <div className="animate-slide-in" style={{animationDelay: '0.6s'}}>
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-lg">🎨</span>
          <h3 className="text-xl font-bold text-gradient">Color Palette</h3>
        </div>
        
        <div className="glass-card p-6 rounded-xl border border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Primary', color: theme?.colors?.primary || '#8b5cf6' },
              { name: 'Secondary', color: theme?.colors?.secondary || '#64748b' },
              { name: 'Success', color: '#22c55e' },
              { name: 'Warning', color: '#f59e0b' },
              { name: 'Destructive', color: '#ef4444' },
              { name: 'Muted', color: '#6b7280' },
              { name: 'Background', color: theme?.colors?.background || '#ffffff' },
              { name: 'Foreground', color: theme?.colors?.foreground || '#0f172a' }
            ].map((colorItem, i) => (
              <div 
                key={i}
                className="text-center hover-lift animate-scale-in"
                style={{animationDelay: `${i * 0.05}s`}}
              >
                <div
                  className="w-full h-16 rounded-lg border border-border/30 shadow-md hover:shadow-lg transition-all duration-200 mb-2 cursor-pointer"
                  style={{ backgroundColor: colorItem.color }}
                ></div>
                <p className="text-xs font-medium text-foreground">{colorItem.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{colorItem.color}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}