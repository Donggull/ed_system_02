'use client'

import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { ArrowLeft, Heart, Plus, Edit, Trash2, Share2, Eye, Download, Star, Calendar } from 'lucide-react'
import { designSystemService, type DesignSystem } from '@/lib/designSystemService'
import ShareModal from '@/components/design-system/ShareModal'
import VersionHistory from '@/components/design-system/VersionHistory'

export default function MyDesignsPage() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSystem, setSelectedSystem] = useState<DesignSystem | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  useEffect(() => {
    fetchMyDesignSystems()
  }, [])

  const fetchMyDesignSystems = async () => {
    try {
      // 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
      const userId = 'temp-user-id'
      const systems = await designSystemService.getUserDesignSystems(userId)
      setDesignSystems(systems)
    } catch (error) {
      console.error('디자인 시스템 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (systemId: string) => {
    if (!confirm('정말로 이 디자인 시스템을 삭제하시겠습니까?')) return

    try {
      const userId = 'temp-user-id'
      await designSystemService.deleteDesignSystem(systemId, userId)
      await fetchMyDesignSystems()
      alert('디자인 시스템이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const handleShare = (system: DesignSystem) => {
    setSelectedSystem(system)
    setShowShareModal(true)
  }

  const handleVersionHistory = (system: DesignSystem) => {
    setSelectedSystem(system)
    setShowVersionHistory(true)
  }

  const handleTogglePublic = async (isPublic: boolean) => {
    if (!selectedSystem) return

    try {
      const userId = 'temp-user-id'
      await designSystemService.togglePublic(selectedSystem.id, userId, isPublic)
      await fetchMyDesignSystems()
      
      // 선택된 시스템 정보 업데이트
      const updatedSystem = await designSystemService.getDesignSystem(selectedSystem.id, userId)
      setSelectedSystem(updatedSystem)
    } catch (error) {
      console.error('공개 설정 변경 실패:', error)
      throw error
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  돌아가기
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart size={24} />
                    내 디자인 시스템
                  </h1>
                  <p className="text-gray-600 mt-1">
                    저장한 디자인 시스템을 관리하고 공유해보세요
                  </p>
                </div>
              </div>
              
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                새 디자인 시스템
              </Link>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : designSystems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Heart size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                저장된 디자인 시스템이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                첫 번째 디자인 시스템을 만들어보세요!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                디자인 시스템 만들기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designSystems.map((system) => (
                <div
                  key={system.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {system.thumbnail_url && (
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={system.thumbnail_url}
                        alt={system.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {system.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {system.is_public ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            공개
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            비공개
                          </span>
                        )}
                      </div>
                    </div>

                    {system.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {system.description}
                      </p>
                    )}

                    {system.tags && system.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {system.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {system.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{system.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {system.favorite_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={14} />
                          {system.download_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {system.rating_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(system.updated_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shared/${system.share_token}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Eye size={14} />
                        보기
                      </Link>
                      
                      <button
                        onClick={() => handleShare(system)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                      
                      <button
                        onClick={() => handleVersionHistory(system)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(system.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 모달들 */}
        {selectedSystem && (
          <>
            <ShareModal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              designSystem={selectedSystem}
              onTogglePublic={handleTogglePublic}
            />
            
            <VersionHistory
              isOpen={showVersionHistory}
              onClose={() => setShowVersionHistory(false)}
              designSystemId={selectedSystem.id}
              designSystemName={selectedSystem.name}
            />
          </>
        )}
      </div>
    </ThemeProvider>
  )
}