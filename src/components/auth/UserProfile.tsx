'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { LogOut, User, Settings } from 'lucide-react'

interface UserProfileProps {
  onSignOut?: () => void
}

export function UserProfile({ onSignOut }: UserProfileProps) {
  const { user, profile, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    onSignOut?.()
    setIsDropdownOpen(false)
  }

  const userName = profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Avatar
          src={avatarUrl}
          alt={userName}
          fallback={userName.charAt(0).toUpperCase()}
          size="sm"
        />
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium text-gray-900">{userName}</div>
          <div className="text-xs text-gray-500">{userEmail}</div>
        </div>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={avatarUrl}
                  alt={userName}
                  fallback={userName.charAt(0).toUpperCase()}
                />
                <div>
                  <div className="font-medium text-gray-900">{userName}</div>
                  <div className="text-sm text-gray-500">{userEmail}</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <User size={16} />
                <span>프로필 설정</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings size={16} />
                <span>설정</span>
              </button>

              <hr className="my-2" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}