'use client'

import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToSignUp={() => setMode('signup')}
            />
          ) : (
            <SignUpForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}