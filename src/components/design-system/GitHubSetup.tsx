'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

interface GitHubSetupProps {
  onSetup: (config: { token: string; owner: string; repo: string }) => void
  className?: string
}

export const GitHubSetup: React.FC<GitHubSetupProps> = ({ onSetup, className }) => {
  const [token, setToken] = useState('')
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState('')

  // GitHub 토큰 유효성 검사
  const validateToken = async () => {
    if (!token) {
      setError('GitHub 토큰을 입력해주세요.')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setOwner(userData.login)
        setIsValid(true)
        setError('')
      } else {
        setIsValid(false)
        setError('유효하지 않은 GitHub 토큰입니다.')
      }
    } catch (err) {
      setIsValid(false)
      setError('토큰 검증 중 오류가 발생했습니다.')
    } finally {
      setIsValidating(false)
    }
  }

  // 설정 완료
  const handleSetup = () => {
    if (!token || !owner || !repo) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    onSetup({ token, owner, repo })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>GitHub 설정</span>
          {isValid && <Badge variant="secondary">연결됨</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            GitHub Personal Access Token
          </label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="flex-1"
            />
            <Button
              onClick={validateToken}
              disabled={isValidating || !token}
              size="sm"
            >
              {isValidating ? '검증 중...' : '검증'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            GitHub Settings → Developer settings → Personal access tokens에서 생성할 수 있습니다.
          </p>
        </div>

        {isValid && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                저장소 소유자
              </label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="username 또는 organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                저장소 이름
              </label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="design-system-components"
              />
            </div>

            <Button
              onClick={handleSetup}
              disabled={!token || !owner || !repo}
              className="w-full"
            >
              GitHub 연동 설정 완료
            </Button>
          </>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• GitHub Personal Access Token은 다음 권한이 필요합니다:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>repo (전체 저장소 접근)</li>
            <li>workflow (GitHub Actions 워크플로우)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
