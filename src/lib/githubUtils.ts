import { ExportUtils } from './exportUtils'

export interface GitHubConfig {
  token: string
  owner: string
  repo: string
  branch?: string
}

export interface GitHubFile {
  path: string
  content: string
  mode: '100644' | '100755' | '040000'
}

export class GitHubUtils {
  private config: GitHubConfig
  private exportUtils: ExportUtils

  constructor(config: GitHubConfig, exportUtils: ExportUtils) {
    this.config = config
    this.exportUtils = exportUtils
  }

  // GitHub 저장소 생성
  async createRepository(name: string, description: string, isPrivate: boolean = false): Promise<any> {
    try {
      const response = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true,
          gitignore_template: 'Node',
          license_template: 'mit'
        })
      })

      if (!response.ok) {
        throw new Error(`GitHub API 오류: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub 저장소 생성 실패:', error)
      throw error
    }
  }

  // 파일들을 GitHub에 푸시
  async pushFiles(files: GitHubFile[], commitMessage: string): Promise<any> {
    try {
      // 현재 브랜치의 최신 커밋 SHA 가져오기
      const latestCommit = await this.getLatestCommit()
      
      // 트리 생성
      const tree = await this.createTree(files, latestCommit.tree.sha)
      
      // 커밋 생성
      const commit = await this.createCommit(commitMessage, tree.sha, latestCommit.sha)
      
      // 브랜치 업데이트
      return await this.updateBranch(commit.sha)
    } catch (error) {
      console.error('GitHub 파일 푸시 실패:', error)
      throw error
    }
  }

  // 최신 커밋 정보 가져오기
  private async getLatestCommit(): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/${this.config.branch || 'main'}`,
      {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`커밋 정보 가져오기 실패: ${response.status}`)
    }

    const ref = await response.json()
    const commitResponse = await fetch(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/commits/${ref.object.sha}`,
      {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    )

    return await commitResponse.json()
  }

  // Git 트리 생성
  private async createTree(files: GitHubFile[], baseTreeSha: string): Promise<any> {
    const tree = files.map(file => ({
      path: file.path,
      mode: file.mode,
      type: 'blob',
      content: file.content
    }))

    const response = await fetch(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tree,
          base_tree: baseTreeSha
        })
      }
    )

    if (!response.ok) {
      throw new Error(`트리 생성 실패: ${response.status}`)
    }

    return await response.json()
  }

  // 커밋 생성
  private async createCommit(message: string, treeSha: string, parentSha: string): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          tree: treeSha,
          parents: [parentSha]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`커밋 생성 실패: ${response.status}`)
    }

    return await response.json()
  }

  // 브랜치 업데이트
  private async updateBranch(commitSha: string): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch || 'main'}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: commitSha
        })
      }
    )

    if (!response.ok) {
      throw new Error(`브랜치 업데이트 실패: ${response.status}`)
    }

    return await response.json()
  }

  // 디자인 시스템을 GitHub에 푸시 (개선된 버전)
  async pushDesignSystem(repoName: string, description: string, isPrivate: boolean = false): Promise<string> {
    try {
      // 1. 저장소 생성
      const repo = await this.createRepository(repoName, description, isPrivate)
      console.log(`저장소 생성 완료: ${repo.html_url}`)
      
      // 저장소 생성 후 약간의 지연 (GitHub API 안정성을 위해)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 2. 파일 구조 생성
      const files = this.exportUtils.generateGitHubStructure()
      
      // 3. 테스트 파일들도 추가
      const testFiles = this.exportUtils.generateComponentTests()
      const allFiles = { ...files, ...testFiles }
      
      // 4. 추가 설정 파일들 생성
      allFiles['src/lib/utils.ts'] = this.generateUtilsFile()
      allFiles['.gitignore'] = this.generateGitignoreFile()
      allFiles['.eslintrc.js'] = this.generateEslintConfigFile()
      allFiles['.storybook/main.ts'] = this.generateStorybookMainFile()
      allFiles['.storybook/preview.ts'] = this.generateStorybookPreviewFile()
      
      // 5. GitHub Actions 워크플로우 추가
      allFiles['.github/workflows/ci.yml'] = this.generateGitHubActionsWorkflow()
      allFiles['.github/workflows/publish.yml'] = this.generatePublishWorkflow()
      
      // 6. GitHub 파일 형식으로 변환
      const githubFiles: GitHubFile[] = Object.entries(allFiles).map(([path, content]) => ({
        path,
        content,
        mode: '100644' as const
      }))
      
      console.log(`총 ${githubFiles.length}개 파일 업로드 시작...`)
      
      // 7. 파일들을 배치로 푸시
      await this.pushFiles(githubFiles, '🎨 Initial design system setup\n\n- Add all component files\n- Add Storybook configuration\n- Add testing setup\n- Add CI/CD workflows')
      
      console.log('모든 파일 업로드 완료!')
      return repo.html_url
      
    } catch (error) {
      console.error('디자인 시스템 GitHub 푸시 실패:', error)
      throw error
    }
  }

  // 추가 파일 생성 메서드들
  private generateUtilsFile(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
  }

  private generateGitignoreFile(): string {
    return `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.tsbuildinfo
next-env.d.ts

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Storybook
/storybook-static
`
  }

  private generateEslintConfigFile(): string {
    return `module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}`
  }

  private generateStorybookMainFile(): string {
    return `import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}

export default config`
  }

  private generateStorybookPreviewFile(): string {
    return `import type { Preview } from '@storybook/react'
import '../src/styles/variables.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
}

export default preview`
  }

  private generateGitHubActionsWorkflow(): string {
    return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run lint
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Build Storybook
      run: npm run build-storybook

  storybook-deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build Storybook
      run: npm run build-storybook
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./storybook-static
`
  }

  private generatePublishWorkflow(): string {
    return `name: Publish to NPM

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Publish to NPM
      run: npm publish
      env:
        NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
`
  }

  // GitHub 토큰 유효성 검사
  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      })
      
      return response.ok
    } catch (error) {
      return false
    }
  }

  // 사용자 정보 가져오기
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      })

      if (!response.ok) {
        throw new Error('사용자 정보 가져오기 실패')
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub 사용자 정보 가져오기 실패:', error)
      throw error
    }
  }
}
