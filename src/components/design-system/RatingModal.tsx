'use client'

import { useState } from 'react'
import { DesignSystemService } from '@/lib/designSystemService'
import Button from '@/components/ui/Button'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  designSystemId: string | null
  designSystemName?: string
}

export default function RatingModal({ isOpen, onClose, designSystemId, designSystemName }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!designSystemId || rating === 0) {
      alert('평점을 선택해주세요.')
      return
    }

    try {
      setIsLoading(true)
      await DesignSystemService.addRating(designSystemId, rating, feedback || undefined)
      alert('평가가 완료되었습니다!')
      handleClose()
    } catch (error) {
      console.error('Failed to submit rating:', error)
      alert('평가 제출에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setFeedback('')
    onClose()
  }

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`w-8 h-8 transition-colors ${
              star <= rating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <svg 
              className="w-full h-full" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        ))}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">디자인 시스템 평가</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {designSystemName && (
            <div>
              <h3 className="font-medium text-center">"{designSystemName}"</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                이 디자인 시스템이 어떠셨나요?
              </p>
            </div>
          )}

          <div className="text-center">
            <label className="block text-sm font-medium mb-3">평점</label>
            <StarRating rating={rating} onRatingChange={setRating} />
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                {rating === 0 && '평점을 선택해주세요'}
                {rating === 1 && '매우 불만족'}
                {rating === 2 && '불만족'}
                {rating === 3 && '보통'}
                {rating === 4 && '만족'}
                {rating === 5 && '매우 만족'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">피드백 (선택사항)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              placeholder="디자인 시스템에 대한 의견을 자유롭게 남겨주세요..."
              maxLength={500}
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {feedback.length}/500
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || rating === 0}
            >
              {isLoading ? '제출 중...' : '평가 제출'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}