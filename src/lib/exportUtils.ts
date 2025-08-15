import JSZip from 'jszip'
import { GeneratedCode, ComponentCode } from './codeGenerator'
import { DesignSystemTheme } from '@/contexts/DesignSystemContext'

export interface ExportOptions {
  format: 'react' | 'vue' | 'html' | 'typescript' | 'css' | 'storybook' | 'all'
  includeTheme?: boolean
  includeComponents?: boolean
  includeDocumentation?: boolean
}

export interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  types: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
  keywords: string[]
  author: string
  license: string
}

export class ExportUtils {
  private theme: DesignSystemTheme
  private components: ComponentCode[]
  private generatedCode: GeneratedCode

  constructor(theme: DesignSystemTheme, components: ComponentCode[], generatedCode: GeneratedCode) {
    this.theme = theme
    this.components = components
    this.generatedCode = generatedCode
  }

  // ZIP 파일 생성 (JSZip 사용)
  async createZipFile(): Promise<Blob> {
    const zip = new JSZip()
    
    // 프로젝트 구조 생성
    const files = this.generateGitHubStructure()
    
    // 각 파일을 ZIP에 추가
    Object.entries(files).forEach(([filePath, content]) => {
      zip.file(filePath, content)
    })
    
    // utils 파일 추가
    zip.file('src/lib/utils.ts', this.generateUtilsFile())
    
    // .gitignore 파일 추가
    zip.file('.gitignore', this.generateGitignore())
    
    // ESLint 설정 추가
    zip.file('.eslintrc.js', this.generateEslintConfig())
    
    // Storybook 설정 추가
    zip.file('.storybook/main.ts', this.generateStorybookMain())
    zip.file('.storybook/preview.ts', this.generateStorybookPreview())
    
    // 테스트 파일들 추가
    const testFiles = this.generateComponentTests()
    Object.entries(testFiles).forEach(([filePath, content]) => {
      zip.file(filePath, content)
    })
    
    // ZIP 파일 생성
    return await zip.generateAsync({ type: 'blob' })
  }

  // 파일 구조 생성
  private generateFileStructure(): string {
    const structure = [
      'design-system/',
      '├── src/',
      '│   ├── components/',
      ...this.components.map(c => `│   │   ├── ${c.name}/`),
      ...this.components.map(c => `│   │   │   ├── ${c.name}.tsx`),
      ...this.components.map(c => `│   │   │   ├── ${c.name}.stories.tsx`),
      ...this.components.map(c => `│   │   │   └── index.ts`),
      '│   ├── styles/',
      '│   │   └── variables.css',
      '│   ├── types/',
      '│   │   └── index.ts',
      '│   └── utils/',
      '│       └── index.ts',
      '├── package.json',
      '├── README.md',
      '├── CHANGELOG.md',
      '└── LICENSE'
    ].join('\n')

    return structure
  }

  // NPM 패키지용 package.json 생성
  generatePackageJson(): PackageJson {
    return {
      name: 'design-system-components',
      version: '1.0.0',
      description: 'A modern design system component library',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        'build': 'tsc',
        'dev': 'tsc --watch',
        'storybook': 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
        'test': 'jest',
        'lint': 'eslint src --ext .ts,.tsx',
        'lint:fix': 'eslint src --ext .ts,.tsx --fix'
      },
      dependencies: {
        'react': '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        '@storybook/react': '^7.0.0',
        '@storybook/addon-essentials': '^7.0.0',
        '@storybook/addon-interactions': '^7.0.0',
        '@storybook/testing-library': '^0.2.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'jest': '^29.0.0'
      },
      peerDependencies: {
        'react': '>=16.8.0',
        'react-dom': '>=16.8.0'
      },
      keywords: [
        'design-system',
        'components',
        'react',
        'typescript',
        'ui',
        'accessible'
      ],
      author: 'Design System Team',
      license: 'MIT'
    }
  }

  // README.md 생성
  generateREADME(): string {
    return `# Design System Components

현대적이고 접근 가능한 React 컴포넌트 라이브러리입니다.

## 설치

\`\`\`bash
npm install design-system-components
# 또는
yarn add design-system-components
\`\`\`

## 사용법

\`\`\`tsx
import { Button, Input, Card } from 'design-system-components'

function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input label="Email" placeholder="Enter your email" />
      <Card>
        <CardHeader>
          <CardTitle>Hello World</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a card component</p>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\`

## 컴포넌트

${this.components.map(c => `- **${c.name}**: ${this.getComponentDescription(c.name)}`).join('\n')}

## 테마 커스터마이징

CSS 변수를 사용하여 테마를 커스터마이징할 수 있습니다:

\`\`\`css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* 기타 변수들... */
}
\`\`\`

## 개발

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# Storybook 시작
npm run storybook

# 빌드
npm run build
\`\`\`

## 라이선스

MIT License
`
  }

  // 컴포넌트 설명 가져오기
  private getComponentDescription(componentName: string): string {
    const descriptions: Record<string, string> = {
      Button: '다양한 스타일과 크기의 버튼 컴포넌트',
      Input: '라벨, 에러 상태, 도움말 텍스트를 지원하는 입력 필드',
      Card: '콘텐츠를 그룹화하는 카드 컴포넌트',
      Typography: '일관된 텍스트 스타일링을 위한 타이포그래피 컴포넌트'
    }
    return descriptions[componentName] || '재사용 가능한 UI 컴포넌트'
  }

  // CHANGELOG.md 생성
  generateCHANGELOG(): string {
    return `# Changelog

모든 주요 변경사항은 이 파일에 기록됩니다.

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### 추가됨
- Button 컴포넌트
- Input 컴포넌트  
- Card 컴포넌트
- CSS 변수 기반 테마 시스템
- TypeScript 타입 정의
- Storybook 스토리

### 변경됨
- 초기 릴리스

### 제거됨
- 없음
`
  }

  // LICENSE 파일 생성
  generateLICENSE(): string {
    return `MIT License

Copyright (c) ${new Date().getFullYear()} Design System Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`
  }

  // API 문서 생성 (Markdown)
  generateAPIDocumentation(): string {
    return `# API Documentation

## Component API Reference

${this.components.map(component => this.generateComponentAPIDoc(component)).join('\n\n')}

## Design Tokens

### Colors

${Object.entries(this.theme.colors).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Typography

#### Font Sizes
${Object.entries(this.theme.typography.fontSize).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

#### Font Weights
${Object.entries(this.theme.typography.fontWeight).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Spacing

${Object.entries(this.theme.spacing).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Border Radius

${Object.entries(this.theme.borderRadius).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Shadows

${Object.entries(this.theme.shadows).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

## Usage Examples

### Basic Setup

\`\`\`tsx
import { Button, Input, Card } from 'design-system-components'
import 'design-system-components/dist/styles.css'

function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input label="Your name" placeholder="Enter name..." />
      <Card>
        <Card.Header>
          <Card.Title>Example Card</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>This is an example card content.</p>
        </Card.Content>
      </Card>
    </div>
  )
}
\`\`\`

### Theming

\`\`\`css
:root {
  --color-primary: #your-brand-color;
  --color-secondary: #your-secondary-color;
  /* Override other CSS variables as needed */
}
\`\`\`

### TypeScript Support

All components include full TypeScript definitions:

\`\`\`tsx
import { ButtonProps } from 'design-system-components'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
\`\`\`
`
  }

  // 개별 컴포넌트 API 문서 생성
  private generateComponentAPIDoc(component: ComponentCode): string {
    const propsTable = this.extractPropsFromTypeScript(component.typescript)
    
    return `### ${component.name}

${this.getComponentDescription(component.name)}

#### Props

${propsTable}

#### Usage

\`\`\`tsx
${this.getUsageExample(component.name)}
\`\`\`

#### Variants

${this.getVariants(component.name)}

#### Accessibility

${this.getAccessibilityInfo(component.name)}`
  }

  // TypeScript에서 Props 정보 추출
  private extractPropsFromTypeScript(typescript: string): string {
    const lines = typescript.split('\n')
    let inInterface = false
    let props: string[] = []
    
    for (const line of lines) {
      if (line.includes('interface') && line.includes('Props')) {
        inInterface = true
        continue
      }
      
      if (inInterface) {
        if (line.includes('}')) {
          break
        }
        
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('//')) {
          props.push(`| ${trimmed.replace('?:', ' | ').replace(':', ' | ')} |`)
        }
      }
    }
    
    if (props.length === 0) {
      return '이 컴포넌트는 props를 받지 않습니다.'
    }
    
    return `| Prop | Type | Required | Description |
|------|------|----------|-------------|
${props.join('\n')}`
  }

  // 사용 예시 생성
  private getUsageExample(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return `// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="lg">
  Primary Button
</Button>

// With onClick handler
<Button onClick={() => console.log('Clicked!')}>
  Interactive Button
</Button>`

      case 'input':
        return `// Basic usage
<Input label="Email" placeholder="Enter your email..." />

// With error state
<Input 
  label="Password"
  type="password"
  error="Password is required"
/>

// With helper text
<Input 
  label="Username"
  helperText="Username must be unique"
/>`

      case 'card':
        return `// Basic usage
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>`

      case 'badge':
        return `// Basic usage
<Badge>Default</Badge>

// With variants
<Badge variant="primary">Primary</Badge>
<Badge variant="destructive">Error</Badge>

// With different sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>`

      case 'avatar':
        return `// With image
<Avatar src="/avatar.jpg" alt="User Avatar" />

// With fallback text
<Avatar fallback="JD" alt="John Doe" />

// Different sizes
<Avatar size="sm" src="/avatar.jpg" />
<Avatar size="xl" src="/avatar.jpg" />`

      case 'typography':
        return `// Different variants
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h2">Sub Heading</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="caption">Caption text</Typography>

// Custom element
<Typography variant="h2" as="div">
  H2 styling on div element
</Typography>`

      default:
        return `<${componentName}>
  Example usage
</${componentName}>`
    }
  }

  // 컴포넌트 변형 정보
  private getVariants(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return `- **default**: Standard button style
- **primary**: Primary action button
- **secondary**: Secondary action button  
- **destructive**: For dangerous actions

**Sizes**: sm, md, lg`

      case 'input':
        return `- **default**: Standard input field
- **error**: Error state with red border

**States**: normal, focused, error, disabled`

      case 'badge':
        return `- **default**: Standard badge
- **primary**: Primary colored badge
- **secondary**: Secondary colored badge
- **destructive**: Error/warning badge
- **success**: Success badge

**Sizes**: sm, md, lg`

      case 'avatar':
        return `**Sizes**: sm (32px), md (40px), lg (48px), xl (64px)

**States**: with image, fallback text, error fallback`

      case 'typography':
        return `**Variants**: h1, h2, h3, h4, h5, h6, body1, body2, caption, small

**Customization**: Use the \`as\` prop to change the HTML element while keeping the styling`

      default:
        return 'No variants available for this component.'
    }
  }

  // 접근성 정보
  private getAccessibilityInfo(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return `- Uses semantic \`<button>\` element
- Supports keyboard navigation (Enter/Space)
- Includes focus indicators
- Screen reader compatible
- Disabled state properly communicated`

      case 'input':
        return `- Proper label association with \`htmlFor\`
- Error messages announced to screen readers
- Keyboard navigation support
- Required state indication
- Placeholder text for guidance`

      case 'card':
        return `- Semantic HTML structure
- Proper heading hierarchy in Card.Title
- Keyboard navigation within card content
- Focus management for interactive elements`

      case 'badge':
        return `- Uses appropriate ARIA labels when needed
- Color is not the only way to convey information
- Sufficient color contrast ratios
- Screen reader friendly text`

      case 'avatar':
        return `- Includes proper alt text for images
- Fallback text is screen reader accessible
- Proper focus indicators
- Image loading error handling`

      case 'typography':
        return `- Semantic HTML elements (h1, h2, p, etc.)
- Proper heading hierarchy
- Sufficient color contrast
- Responsive text scaling
- Screen reader friendly content`

      default:
        return 'Standard accessibility practices applied.'
    }
  }

  // 설치 가이드 생성
  generateInstallationGuide(): string {
    return `# Installation Guide

## NPM Installation

\`\`\`bash
npm install design-system-components
# or
yarn add design-system-components
\`\`\`

## Setup

### 1. Import Components

\`\`\`tsx
import { Button, Input, Card } from 'design-system-components'
\`\`\`

### 2. Import Styles

\`\`\`tsx
// In your main App component or index file
import 'design-system-components/dist/styles.css'
\`\`\`

### 3. TypeScript Support

TypeScript definitions are included automatically. No additional setup required.

## Framework Integration

### Next.js

\`\`\`tsx
// pages/_app.tsx
import 'design-system-components/dist/styles.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
\`\`\`

### Create React App

\`\`\`tsx
// src/index.tsx
import 'design-system-components/dist/styles.css'
\`\`\`

### Vite

\`\`\`tsx
// src/main.tsx
import 'design-system-components/dist/styles.css'
\`\`\`

## Customization

### CSS Variables

Override the default theme by setting CSS variables:

\`\`\`css
:root {
  --color-primary: #your-primary-color;
  --color-secondary: #your-secondary-color;
  --font-family: 'Your Font Family', sans-serif;
  /* Add other overrides... */
}
\`\`\`

### Tailwind CSS Integration

If you're using Tailwind CSS, you can extend the default configuration:

\`\`\`js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/design-system-components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      }
    }
  }
}
\`\`\`

## Bundle Size Optimization

### Tree Shaking

Import only the components you need:

\`\`\`tsx
// Instead of
import { Button, Input, Card } from 'design-system-components'

// Use individual imports for better tree shaking
import { Button } from 'design-system-components/dist/Button'
import { Input } from 'design-system-components/dist/Input'
\`\`\`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Styles Not Loading

Make sure you've imported the CSS file:

\`\`\`tsx
import 'design-system-components/dist/styles.css'
\`\`\`

### TypeScript Errors

Update your TypeScript configuration to include the library:

\`\`\`json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
\`\`\`
`
  }

  // GitHub 저장소용 파일 구조 생성
  generateGitHubStructure(): Record<string, string> {
    const files: Record<string, string> = {
      'package.json': JSON.stringify(this.generatePackageJson(), null, 2),
      'README.md': this.generateREADME(),
      'CHANGELOG.md': this.generateCHANGELOG(),
      'LICENSE': this.generateLICENSE(),
      'docs/API.md': this.generateAPIDocumentation(),
      'docs/INSTALLATION.md': this.generateInstallationGuide(),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noFallthroughCasesInSwitch: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: false,
          jsx: 'react-jsx',
          outDir: 'dist',
          declaration: true
        },
        include: ['src'],
        exclude: ['node_modules', 'dist', '**/*.stories.tsx', '**/*.test.tsx']
      }, null, 2),
      'src/index.ts': this.generateIndexFile(),
      'src/styles/variables.css': this.generatedCode.css,
      'src/types/index.ts': this.generatedCode.typescript
    }

    // 각 컴포넌트별 파일 추가
    this.components.forEach(component => {
      files[`src/components/${component.name}/${component.name}.tsx`] = component.react
      files[`src/components/${component.name}/${component.name}.stories.tsx`] = component.storybook
      files[`src/components/${component.name}/index.ts`] = `export { ${component.name} } from './${component.name}'`
    })

    return files
  }

  // 메인 인덱스 파일 생성
  private generateIndexFile(): string {
    const exports = this.components.map(c => `export { ${c.name} } from './components/${c.name}'`).join('\n')
    return `${exports}

export * from './types'
export * from './styles/variables.css'
`
  }

  // 개별 컴포넌트 코드 복사
  copyComponentCode(componentName: string, format: 'react' | 'vue' | 'html' | 'typescript' | 'css' | 'storybook'): string {
    const component = this.components.find(c => c.name === componentName)
    if (!component) return ''
    
    return component[format] || ''
  }

  // 전체 코드 복사
  copyFullCode(format: 'react' | 'vue' | 'html' | 'typescript' | 'css' | 'storybook'): string {
    return this.generatedCode[format] || ''
  }

  // 다운로드 링크 생성
  createDownloadLink(): string {
    const content = this.generateFileStructure()
    const blob = new Blob([content], { type: 'text/plain' })
    return URL.createObjectURL(blob)
  }

  // utils.ts 파일 생성
  private generateUtilsFile(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
  }

  // .gitignore 파일 생성
  private generateGitignore(): string {
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

  // ESLint 설정 생성
  private generateEslintConfig(): string {
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

  // Storybook main.ts 설정 생성
  private generateStorybookMain(): string {
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

  // Storybook preview.ts 설정 생성
  private generateStorybookPreview(): string {
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

  // 컴포넌트 테스트 파일 생성
  generateComponentTests(): Record<string, string> {
    const tests: Record<string, string> = {}
    
    this.components.forEach(component => {
      tests[`src/components/${component.name}/${component.name}.test.tsx`] = `import { render, screen } from '@testing-library/react'
import { ${component.name} } from './${component.name}'

describe('${component.name}', () => {
  it('renders correctly', () => {
    render(${this.getTestRenderCode(component.name)})
    expect(screen.getByRole(${this.getTestRole(component.name)})).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-test-class'
    render(${this.getTestRenderCodeWithClass(component.name)})
    expect(screen.getByRole(${this.getTestRole(component.name)})).toHaveClass(customClass)
  })
})`
    })
    
    // Jest 설정 파일 추가
    tests['jest.config.js'] = `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)`

    tests['jest.setup.js'] = `import '@testing-library/jest-dom'`
    
    return tests
  }

  // 테스트 렌더 코드 생성 도움 함수
  private getTestRenderCode(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return '<Button>Test Button</Button>'
      case 'input':
        return '<Input label="Test Input" />'
      case 'card':
        return '<Card>Test Card</Card>'
      case 'badge':
        return '<Badge>Test Badge</Badge>'
      case 'avatar':
        return '<Avatar alt="Test Avatar" />'
      case 'typography':
        return '<Typography>Test Typography</Typography>'
      default:
        return `<${componentName}>Test ${componentName}</${componentName}>`
    }
  }

  private getTestRenderCodeWithClass(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return '<Button className={customClass}>Test Button</Button>'
      case 'input':
        return '<Input className={customClass} label="Test Input" />'
      case 'card':
        return '<Card className={customClass}>Test Card</Card>'
      case 'badge':
        return '<Badge className={customClass}>Test Badge</Badge>'
      case 'avatar':
        return '<Avatar className={customClass} alt="Test Avatar" />'
      case 'typography':
        return '<Typography className={customClass}>Test Typography</Typography>'
      default:
        return `<${componentName} className={customClass}>Test ${componentName}</${componentName}>`
    }
  }

  private getTestRole(componentName: string): string {
    switch (componentName.toLowerCase()) {
      case 'button':
        return "'button'"
      case 'input':
        return "'textbox'"
      case 'card':
      case 'badge':
      case 'avatar':
      case 'typography':
        return "'generic'"
      default:
        return "'generic'"
    }
  }
}
