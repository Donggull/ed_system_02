'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Heart, Download, Star, Calendar, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DesignSystemWithDetails } from '@/lib/designSystemService'
import RatingModal from '@/components/design-system/RatingModal'

export default function SharedDesignSystemPage() {
  const params = useParams()
  const token = params.token as string
  
  const [designSystem, setDesignSystem] = useState<DesignSystemWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(0)

  const fetchDesignSystem = useCallback(async () => {
    try {
      const response = await fetch(`/api/design-systems/shared/${token}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('디자인 시스템을 찾을 수 없습니다.')
        } else {
          setError('디자인 시스템을 불러오는데 실패했습니다.')
        }
        return
      }

      const data = await response.json()
      setDesignSystem(data)
    } catch (err) {
      console.error('Error fetching design system:', err)
      setError('디자인 시스템을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchDesignSystem()
    }
  }, [token, fetchDesignSystem])

  const handleRateSubmit = async (rating: number, comment: string) => {
    if (!designSystem) return

    try {
      const response = await fetch(`/api/design-systems/${designSystem.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous', // 익명 사용자로 처리하거나 로그인 시스템과 연동
          rating,
          comment
        })
      })

      if (response.ok) {
        await fetchDesignSystem() // 새로고침해서 업데이트된 평점 반영
      }
    } catch (err) {
      console.error('평점 저장 실패:', err)
      throw err
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareDesignSystem = async () => {
    try {
      await navigator.share({
        title: designSystem?.name,
        text: designSystem?.description || '',
        url: window.location.href
      })
    } catch (error) {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">디자인 시스템을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !designSystem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || '디자인 시스템을 찾을 수 없습니다'}
          </h1>
          <p className="text-gray-600 mb-6">
            링크가 올바른지 확인해주세요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {designSystem.name}
              </h1>
              {designSystem.description && (
                <p className="text-gray-600 mb-4">
                  {designSystem.description}
                </p>
              )}
              
              {designSystem.tags && designSystem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {designSystem.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={shareDesignSystem}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                title="공유하기"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart size={16} />
              {designSystem.favorite_count} 좋아요
            </span>
            <span className="flex items-center gap-1">
              <Download size={16} />
              {designSystem.download_count} 다운로드
            </span>
            <span className="flex items-center gap-1">
              <Star size={16} />
              {designSystem.rating_average.toFixed(1)} ({designSystem.rating_count}개 평가)
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {formatDate(designSystem.updated_at)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Star size={16} />
              평가하기
            </button>
          </div>
        </div>

        {/* 테마 선택 */}
        {designSystem.themes && designSystem.themes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">테마</h2>
            <div className="flex gap-4">
              {designSystem.themes.map((theme, index) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(index)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    currentTheme === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className="font-medium">{theme.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {Object.entries(theme.colors).slice(0, 5).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: color as string }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 컴포넌트 미리보기 */}
        {designSystem.components && designSystem.components.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">컴포넌트</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {designSystem.components.map((component) => (
                <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{component.name}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    타입: {component.type}
                  </div>
                  <div className="bg-gray-50 rounded p-4">
                    <p className="text-sm text-gray-500">
                      컴포넌트 미리보기는 편집 모드에서만 사용 가능합니다.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 평점 모달 */}
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          designSystemName={designSystem.name}
          onSubmit={handleRateSubmit}
        />
      </div>
    </div>
  )
}