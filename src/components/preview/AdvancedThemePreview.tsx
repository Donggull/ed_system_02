'use client'

import { useDesignSystem } from '@/contexts/DesignSystemContext'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Chart from './Chart'
import { getThemeColor, applyOpacity, getThemeGradient, getChartColors, getContrastColor } from '@/lib/themeUtils'

interface AdvancedThemePreviewProps {
  className?: string
  theme?: any
}

export default function AdvancedThemePreview({ className, theme: propTheme }: AdvancedThemePreviewProps) {
  const { theme: contextTheme } = useDesignSystem()
  const theme = propTheme || contextTheme

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

  // 샘플 데이터
  const salesData = [2400, 1398, 3800, 3908, 4800, 3800, 4300]
  const salesLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월']
  
  const userGrowth = [1000, 1200, 1500, 1800, 2100, 2600, 3200]
  const userLabels = ['1주', '2주', '3주', '4주', '5주', '6주', '7주']

  const recentActivities = [
    { user: '김개발', action: '새 프로젝트 생성', time: '2분 전', type: 'create' },
    { user: '이디자인', action: '디자인 시스템 업데이트', time: '15분 전', type: 'update' },
    { user: '박매니저', action: '리뷰 완료', time: '1시간 전', type: 'review' },
    { user: '최기획', action: '문서 공유', time: '2시간 전', type: 'share' },
    { user: '한개발', action: 'PR 병합', time: '3시간 전', type: 'merge' }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <span className="text-success">➕</span>
      case 'update':
        return <span className="text-primary">🔄</span>
      case 'review':
        return <span className="text-warning">👁️</span>
      case 'share':
        return <span className="text-info">📤</span>
      case 'merge':
        return <span className="text-success">🔀</span>
      default:
        return <span>📝</span>
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 대시보드 헤더 */}
      <div 
        className="glass-card p-6 rounded-2xl animate-fade-in"
        style={{ 
          borderColor: applyOpacity(borderColor, 0.3),
          backgroundColor: applyOpacity(backgroundColor, 0.8)
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: primaryColor, textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}` }}
            >
              Dashboard
            </h1>
            <p style={{ color: mutedColor }}>실시간 프로젝트 현황과 통계를 확인하세요</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              style={{ 
                borderColor: borderColor,
                color: foregroundColor,
                backgroundColor: 'transparent'
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              새로고침
            </Button>
            <Button 
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.9)} 100%)`,
                color: primaryTextColor,
                border: 'none'
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 프로젝트
            </Button>
          </div>
        </div>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: '총 매출', 
            value: '₩3,240만', 
            change: '+15.2%', 
            trend: 'up',
            description: '이번 달',
            icon: '💰'
          },
          { 
            title: '활성 사용자', 
            value: '8,429명', 
            change: '+8.1%', 
            trend: 'up',
            description: '지난 주',
            icon: '👥'
          },
          { 
            title: '전환율', 
            value: '12.5%', 
            change: '-2.4%', 
            trend: 'down',
            description: '평균',
            icon: '📊'
          },
          { 
            title: '만족도', 
            value: '94.2%', 
            change: '+1.2%', 
            trend: 'up',
            description: '고객 평가',
            icon: '⭐'
          }
        ].map((kpi, i) => (
          <div 
            key={i}
            className="glass-card p-6 rounded-xl hover-lift animate-scale-in"
            style={{
              animationDelay: `${i * 0.1}s`,
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.8)
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)` 
                }}
              >
                <span style={{ color: primaryTextColor }}>{kpi.icon}</span>
              </div>
              <Badge 
                size="sm"
                style={{ 
                  backgroundColor: kpi.trend === 'up' ? applyOpacity(successColor, 0.1) : applyOpacity(destructiveColor, 0.1),
                  color: kpi.trend === 'up' ? successColor : destructiveColor,
                  borderColor: kpi.trend === 'up' ? applyOpacity(successColor, 0.3) : applyOpacity(destructiveColor, 0.3)
                }}
              >
                {kpi.change}
              </Badge>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: mutedColor }}>{kpi.title}</p>
              <p className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: mutedColor }}>{kpi.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 메인 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 매출 차트 */}
        <div 
          className="lg:col-span-2 glass-card p-6 rounded-xl animate-slide-in"
          style={{ 
            borderColor: applyOpacity(borderColor, 0.3),
            backgroundColor: applyOpacity(backgroundColor, 0.8)
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold" style={{ color: foregroundColor }}>월별 매출 현황</h3>
              <p className="text-sm" style={{ color: mutedColor }}>2024년 상반기</p>
            </div>
            <div className="flex space-x-2">
              <Badge 
                size="sm"
                style={{ 
                  backgroundColor: applyOpacity(primaryColor, 0.1),
                  color: primaryColor,
                  borderColor: applyOpacity(primaryColor, 0.3)
                }}
              >
                매출
              </Badge>
              <Badge 
                variant="outline" 
                size="sm"
                style={{ 
                  borderColor: borderColor,
                  color: mutedColor
                }}
              >
                목표
              </Badge>
            </div>
          </div>
          <Chart 
            data={salesData} 
            labels={salesLabels} 
            height={300}
            animated={true}
            theme={theme}
          />
        </div>

        {/* 사용자 증가 차트 */}
        <div 
          className="glass-card p-6 rounded-xl animate-slide-in" 
          style={{
            animationDelay: '0.2s',
            borderColor: applyOpacity(borderColor, 0.3),
            backgroundColor: applyOpacity(backgroundColor, 0.8)
          }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2" style={{ color: foregroundColor }}>사용자 증가</h3>
            <p className="text-sm" style={{ color: mutedColor }}>주간 신규 가입자</p>
          </div>
          <Chart 
            data={userGrowth} 
            labels={userLabels} 
            height={200}
            animated={true}
            theme={theme}
            colors={[successColor]}
          />
          <div 
            className="mt-4 p-3 rounded-lg"
            style={{ backgroundColor: applyOpacity(borderColor, 0.2) }}
          >
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: mutedColor }}>총 사용자</span>
              <span className="font-semibold" style={{ color: primaryColor }}>12,847명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 & 프로젝트 상태 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="glass-card p-6 rounded-xl border border-border/30 animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">최근 활동</h3>
            <Button variant="outline" size="sm">전체보기</Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div 
                key={i} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 animate-fade-in"
                style={{animationDelay: `${(i + 1) * 0.05}s`}}
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    <span className="text-primary">{activity.user}</span>님이 {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 프로젝트 상태 */}
        <div className="glass-card p-6 rounded-xl border border-border/30 animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">프로젝트 현황</h3>
            <Badge variant="secondary" size="sm">5개 진행중</Badge>
          </div>
          <div className="space-y-4">
            {[
              { name: '디자인 시스템 v2.0', progress: 85, status: '진행중', due: '2일 남음' },
              { name: 'Mobile App 리뉴얼', progress: 60, status: '진행중', due: '1주 남음' },
              { name: 'API 통합', progress: 95, status: '리뷰중', due: '오늘' },
              { name: 'Landing Page', progress: 30, status: '시작됨', due: '2주 남음' }
            ].map((project, i) => (
              <div 
                key={i}
                className="animate-fade-in"
                style={{animationDelay: `${(i + 1) * 0.1}s`}}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{project.name}</span>
                  <span className="text-xs text-muted-foreground">{project.due}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${project.progress}%`,
                        animationDelay: `${(i + 1) * 0.2}s`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gradient">{project.progress}%</span>
                </div>
                <div className="mt-1">
                  <Badge 
                    variant={
                      project.status === '완료' ? 'secondary' :
                      project.status === '리뷰중' ? 'destructive' : 'outline'
                    } 
                    size="sm"
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}