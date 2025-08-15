'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, History, Calendar, ChevronDown, ChevronRight } from 'lucide-react'

interface Version {
  id: string
  version: number
  data: Record<string, unknown>
  changelog: string | null
  created_at: string
}

interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
  designSystemId: string
  designSystemName: string
}

export default function VersionHistory({ 
  isOpen, 
  onClose, 
  designSystemId,
  designSystemName 
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchVersions()
    }
  }, [isOpen, fetchVersions])

  const fetchVersions = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/design-systems/${designSystemId}/versions`)
      if (response.ok) {
        const data = await response.json()
        setVersions(data)
      }
    } catch (error) {
      console.error('버전 히스토리 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [designSystemId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleExpanded = (version: number) => {
    setExpandedVersion(expandedVersion === version ? null : version)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History size={20} />
            버전 히스토리
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900">{designSystemName}</h3>
            <p className="text-sm text-gray-600">
              디자인 시스템의 변경 이력을 확인할 수 있습니다.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              버전 히스토리가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpanded(version.version)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedVersion === version.version ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">v{version.version}</span>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                최신
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(version.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {version.changelog && (
                      <p className="text-sm text-gray-700 mt-2 ml-6">
                        {version.changelog}
                      </p>
                    )}
                  </div>

                  {expandedVersion === version.version && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">변경 내용</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">컴포넌트:</span>
                              <span className="ml-2 text-gray-600">
                                {version.data.components?.length || 0}개
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">테마:</span>
                              <span className="ml-2 text-gray-600">
                                {version.data.themes?.length || 0}개
                              </span>
                            </div>
                          </div>
                        </div>

                        {version.data.tags && version.data.tags.length > 0 && (
                          <div>
                            <span className="font-medium text-sm text-gray-700">태그:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {version.data.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}