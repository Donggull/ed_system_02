'use client'

import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import BrowseDesignSystems from '@/components/design-system/BrowseDesignSystems'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function BrowsePage() {
  const handleSelectDesignSystem = (designSystem: any) => {
    // 공유 링크로 이동
    window.open(`/shared/${designSystem.share_token}`, '_blank')
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
                    <Search size={24} />
                    디자인 시스템 탐색
                  </h1>
                  <p className="text-gray-600 mt-1">
                    다른 사용자들이 만든 디자인 시스템을 탐색하고 영감을 받아보세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BrowseDesignSystems onSelect={handleSelectDesignSystem} />
        </div>
      </div>
    </ThemeProvider>
  )
}