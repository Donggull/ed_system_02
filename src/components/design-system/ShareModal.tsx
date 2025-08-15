'use client'

import { useState, useEffect } from 'react'
import { DesignSystemService } from '@/lib/designSystemService'
import Button from '@/components/ui/Button'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  designSystemId: string | null
}

export default function ShareModal({ isOpen, onClose, designSystemId }: ShareModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [shareSettings, setShareSettings] = useState({
    accessType: 'link_only' as 'public' | 'link_only',
    expiresAt: '',
    allowDownload: true,
    allowCopy: true
  })

  const handleCreateShareLink = async () => {
    if (!designSystemId) return

    try {
      setIsLoading(true)
      
      const expiresAt = shareSettings.expiresAt 
        ? new Date(shareSettings.expiresAt) 
        : undefined

      const shareToken = await DesignSystemService.createShareLink(
        designSystemId,
        shareSettings.accessType,
        expiresAt
      )

      const baseUrl = window.location.origin
      const generatedLink = `${baseUrl}/shared/${shareToken}`
      setShareLink(generatedLink)
    } catch (error) {
      console.error('Failed to create share link:', error)
      alert('공유 링크 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      alert('링크가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('링크 복사에 실패했습니다.')
    }
  }

  const resetForm = () => {
    setShareLink('')
    setShareSettings({
      accessType: 'link_only',
      expiresAt: '',
      allowDownload: true,
      allowCopy: true
    })
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">디자인 시스템 공유</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {!shareLink ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">접근 방식</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="accessType"
                      value="link_only"
                      checked={shareSettings.accessType === 'link_only'}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, accessType: e.target.value as any }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">링크를 아는 사람만 (권장)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="accessType"
                      value="public"
                      checked={shareSettings.accessType === 'public'}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, accessType: e.target.value as any }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">완전 공개 (검색 가능)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">만료 날짜 (선택사항)</label>
                <input
                  type="datetime-local"
                  value={shareSettings.expiresAt}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  설정하지 않으면 영구적으로 유효합니다
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareSettings.allowDownload}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">다운로드 허용</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareSettings.allowCopy}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, allowCopy: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">복사 허용</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button onClick={handleCreateShareLink} disabled={isLoading}>
                  {isLoading ? '생성 중...' : '공유 링크 생성'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">공유 링크</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted"
                  />
                  <Button size="sm" onClick={handleCopyLink}>
                    복사
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">공유 설정</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>접근 방식: {shareSettings.accessType === 'public' ? '완전 공개' : '링크를 아는 사람만'}</p>
                  {shareSettings.expiresAt && (
                    <p>만료일: {new Date(shareSettings.expiresAt).toLocaleString('ko-KR')}</p>
                  )}
                  <p>다운로드: {shareSettings.allowDownload ? '허용' : '비허용'}</p>
                  <p>복사: {shareSettings.allowCopy ? '허용' : '비허용'}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  새로 만들기
                </Button>
                <Button onClick={onClose}>
                  완료
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}