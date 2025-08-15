'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Grid, List, Heart, Download, Star, Calendar } from 'lucide-react'
import { DesignSystem } from '@/lib/designSystemService'

interface BrowseDesignSystemsProps {
  userId?: string
  onSelect?: (designSystem: DesignSystem) => void
}

interface FilterState {
  category: string
  tags: string[]
  sortBy: 'created_at' | 'updated_at' | 'rating_average' | 'download_count'
  searchQuery: string
}

const CATEGORIES = [
  'All',
  'E-commerce',
  'Dashboard',
  'Landing Page',
  'Mobile App',
  'Web App',
  'Marketing',
  'Blog',
  'Portfolio',
  'Other'
]

const SORT_OPTIONS = [
  { value: 'updated_at', label: '최근 수정' },
  { value: 'created_at', label: '최근 생성' },
  { value: 'rating_average', label: '평점 높은 순' },
  { value: 'download_count', label: '다운로드 많은 순' }
]

export default function BrowseDesignSystems({ userId, onSelect }: BrowseDesignSystemsProps) {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    tags: [],
    sortBy: 'updated_at',
    searchQuery: ''
  })

  useEffect(() => {
    fetchDesignSystems()
  }, [fetchDesignSystems])

  const fetchDesignSystems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort: filters.sortBy
      })

      if (filters.category !== 'All') {
        params.append('category', filters.category)
      }
      if (filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','))
      }
      if (filters.searchQuery) {
        params.append('q', filters.searchQuery)
      }

      const response = await fetch(`/api/design-systems?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDesignSystems(data.systems)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('디자인 시스템 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
    setPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }))
    setPage(1)
  }

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }))
    setPage(1)
  }

  const toggleFavorite = async (designSystemId: string) => {
    if (!userId) return

    try {
      const response = await fetch(`/api/design-systems/${designSystemId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        fetchDesignSystems() // 목록 새로고침
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error)
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

  const DesignSystemCard = ({ system }: { system: DesignSystem }) => (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(system)}
    >
      {system.thumbnail_url && (
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={system.thumbnail_url}
            alt={system.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1">
            {system.name}
          </h3>
          {userId && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(system.id)
              }}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <Heart size={16} />
            </button>
          )}
        </div>

        {system.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {system.description}
          </p>
        )}

        {system.tags && system.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
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

        <div className="flex items-center justify-between text-sm text-gray-500">
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
      </div>
    </div>
  )

  const DesignSystemListItem = ({ system }: { system: DesignSystem }) => (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(system)}
    >
      <div className="flex items-start gap-4">
        {system.thumbnail_url && (
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={system.thumbnail_url}
              alt={system.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {system.name}
            </h3>
            {userId && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(system.id)
                }}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <Heart size={16} />
              </button>
            )}
          </div>

          {system.description && (
            <p className="text-sm text-gray-600 mb-2">
              {system.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(system.updated_at)}
              </span>
            </div>

            {system.tags && system.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {system.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="디자인 시스템 검색..."
              value={filters.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter size={16} />
              필터
            </button>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filters.category === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 결과 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : designSystems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-600">
            다른 검색어나 필터를 시도해보세요.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 {total}개의 디자인 시스템
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designSystems.map(system => (
                <DesignSystemCard key={system.id} system={system} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {designSystems.map(system => (
                <DesignSystemListItem key={system.id} system={system} />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {total > 12 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                이전
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                {page} / {Math.ceil(total / 12)}
              </span>
              
              <button
                onClick={() => setPage(Math.min(Math.ceil(total / 12), page + 1))}
                disabled={page >= Math.ceil(total / 12)}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}