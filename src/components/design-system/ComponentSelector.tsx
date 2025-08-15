'use client'

import { useState } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'

export default function ComponentSelector() {
  const { 
    selectedComponents, 
    toggleComponent, 
    selectAllInCategory, 
    deselectAllInCategory,
    selectAll,
    deselectAll,
    componentCategories 
  } = useDesignSystem()
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isCategoryExpanded = (categoryId: string) => expandedCategories.includes(categoryId)

  const getCategoryStats = (categoryId: string) => {
    const category = componentCategories.find(cat => cat.id === categoryId)
    if (!category) return { selected: 0, total: 0 }
    
    const total = category.components.length
    const selected = category.components.filter(comp => 
      selectedComponents.includes(comp.type)
    ).length
    
    return { selected, total }
  }

  const isAllCategorySelected = (categoryId: string) => {
    const { selected, total } = getCategoryStats(categoryId)
    return selected === total
  }

  const isSomeCategorySelected = (categoryId: string) => {
    const { selected } = getCategoryStats(categoryId)
    return selected > 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          컴포넌트 선택
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            전체 선택
          </button>
          <span className="text-xs text-muted-foreground">•</span>
          <button
            onClick={deselectAll}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            전체 해제
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {componentCategories.map((category) => {
          const { selected, total } = getCategoryStats(category.id)
          const isExpanded = isCategoryExpanded(category.id)
          const isAllSelected = isAllCategorySelected(category.id)
          const isSomeSelected = isSomeCategorySelected(category.id)

          return (
            <div key={category.id} className="border border-border rounded-lg">
              {/* Category Header */}
              <div className="p-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center space-x-2 flex-1 text-left hover:text-primary transition-colors"
                  >
                    {isExpanded ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <span className="font-medium text-foreground">
                      {category.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({selected}/{total})
                    </span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAllInCategory(category.id)
                        } else {
                          deselectAllInCategory(category.id)
                        }
                      }}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Category Components - 고정 높이로 레이아웃 안정화 */}
              <div className={`transition-all duration-200 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="p-3 space-y-2">
                  {category.components.map((component) => (
                    <label
                      key={component.type}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(component.type)}
                        onChange={() => toggleComponent(component.type)}
                        disabled={component.required}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary disabled:opacity-50"
                      />
                      <span className="text-sm text-foreground flex-1">
                        {component.label}
                      </span>
                      {component.required && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          필수
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection Summary - 고정 높이로 레이아웃 안정화 */}
      <div className="p-3 bg-accent rounded-lg min-h-[60px] flex flex-col justify-center">
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent-foreground">
            선택된 컴포넌트
          </span>
          <span className="font-medium text-accent-foreground">
            {selectedComponents.length}개
          </span>
        </div>
        {selectedComponents.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedComponents.slice(0, 8).map((component) => (
              <span
                key={component}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              >
                {componentCategories
                  .flatMap(cat => cat.components)
                  .find(comp => comp.type === component)?.label || component}
              </span>
            ))}
            {selectedComponents.length > 8 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{selectedComponents.length - 8}개 더
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
