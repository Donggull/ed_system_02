'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { AuthModal } from './AuthModal'
import { UserProfile } from './UserProfile'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export function AuthButton() {
  const { user, loading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'signup'>('login')

  if (loading) {
    return <LoadingSpinner size="sm" />
  }

  if (user) {
    return <UserProfile />
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setModalMode('login')
            setIsModalOpen(true)
          }}
        >
          로그인
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setModalMode('signup')
            setIsModalOpen(true)
          }}
        >
          회원가입
        </Button>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMode={modalMode}
      />
    </>
  )
}