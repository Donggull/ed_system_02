'use client'

import React, { useState } from 'react'
import { X, Share2, Copy, Check, Globe, Lock, Eye, Download } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  designSystem: {
    id: string
    name: string
    is_public: boolean
    share_token: string
    favorite_count: number
    download_count: number
    rating_average: number
  }
  onTogglePublic: (isPublic: boolean) => Promise<void>
}

export default function ShareModal({ isOpen, onClose, designSystem, onTogglePublic }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(designSystem.is_public)
  const [loading, setLoading] = useState(false)

  const shareUrl = `${window.location.origin}/shared/${designSystem.share_token}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const handleTogglePublic = async () => {
    setLoading(true)
    try {
      await onTogglePublic(!isPublic)
      setIsPublic(!isPublic)
    } catch (error) {
      console.error('공개 설정 변경 실패:', error)
      alert('설정 변경에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Share2 size={20} />
            디자인 시스템 공유
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{designSystem.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {designSystem.favorite_count} 좋아요
              </span>
              <span className="flex items-center gap-1">
                <Download size={16} />
                {designSystem.download_count} 다운로드
              </span>
              <span className="flex items-center gap-1">
                ⭐ {designSystem.rating_average.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Globe className="text-green-500" size={20} />
                ) : (
                  <Lock className="text-gray-500" size={20} />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {isPublic ? '공개' : '비공개'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isPublic 
                      ? '누구나 이 디자인 시스템을 볼 수 있습니다'
                      : '링크를 가진 사람만 볼 수 있습니다'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleTogglePublic}
                disabled={loading}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isPublic
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {loading ? '변경중...' : (isPublic ? '공개' : '비공개')}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공유 링크
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      복사
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                이 링크를 통해 다른 사람들이 디자인 시스템을 볼 수 있습니다.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}