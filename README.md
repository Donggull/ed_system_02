# Design System Generator

Next.js와 Tailwind CSS를 사용하여 구축된 완전한 디자인 시스템 생성기입니다.

## 🚀 새로운 기능

### 💾 저장 및 관리 시스템
- **클라우드 저장**: Supabase를 통한 디자인 시스템 저장 및 동기화
- **버전 관리**: 디자인 시스템의 변경 이력 추적 및 이전 버전으로 되돌리기
- **태그 및 카테고리**: 디자인 시스템을 체계적으로 분류 및 관리
- **즐겨찾기**: 자주 사용하는 디자인 시스템 북마크

### 🌐 공유 및 협업
- **공개/비공개 설정**: 디자인 시스템을 공개하거나 팀 내에서만 공유
- **공유 링크**: 일시적 또는 영구적 공유 링크 생성
- **커뮤니티 탐색**: 다른 사용자들이 공개한 디자인 시스템 탐색 및 적용
- **평가 시스템**: 디자인 시스템에 대한 평점 및 피드백

### 📊 분석 및 통계
- **다운로드 추적**: 디자인 시스템의 인기도 및 사용률 측정
- **사용자 피드백**: 평점 및 리뷰를 통한 품질 개선

### 실시간 테마 에디터
- **JSON 기반 테마 편집**: 실시간 JSON 편집으로 테마 커스터마이징
- **디바운싱 최적화**: 500ms 디바운싱으로 성능 최적화
- **스키마 검증**: 색상, 타입, CSS 단위 등의 실시간 유효성 검사
- **에러 롤백**: 오류 발생 시 이전 상태로 자동 복구
- **단축키 지원**: Ctrl+S (저장), Ctrl+Z (되돌리기), Ctrl+F (포맷팅)

### 코드 내보내기 시스템
- **다중 형식 지원**: React, Vue, HTML+CSS, TypeScript, CSS, Storybook
- **자동 코드 생성**: 선택된 컴포넌트들의 완전한 코드 생성
- **GitHub 연동**: 자동 저장소 생성 및 파일 푸시
- **NPM 패키지**: package.json, README, CHANGELOG 자동 생성
- **ZIP 다운로드**: 전체 디자인 시스템을 압축 파일로 다운로드

### 고급 컴포넌트 미리보기
- **뷰포트 시뮬레이션**: 모바일/태블릿/데스크톱/와이드 뷰포트
- **확대/축소**: 50% ~ 150% 스케일 조정
- **풀스크린 모드**: 전체화면 미리보기
- **격자/자 표시**: 정밀한 레이아웃 확인
- **실시간 반영**: 테마 변경사항 즉시 적용

### 이미지 시스템
- **플레이스홀더 서비스**: Unsplash, Picsum, 커스텀 플레이스홀더
- **스켈레톤 UI**: 로딩 상태를 위한 애니메이션 스켈레톤
- **에러 처리**: 이미지 로딩 실패 시 대체 이미지
- **아바타 생성**: DiceBear API 기반 아바타 자동 생성

## 주요 기능

- 🎨 **실시간 테마 편집**: JSON 에디터로 즉시 테마 변경
- 💾 **클라우드 저장**: Supabase를 통한 디자인 시스템 저장 및 관리
- 🌐 **공유 및 협업**: 공개/비공개 공유, 커뮤니티 탐색, 평가 시스템
- 📊 **버전 관리**: 변경 이력 추적 및 롤백 기능
- ⭐ **즐겨찾기**: 자주 사용하는 디자인 시스템 북마크
- 🖼️ **이미지 컴포넌트**: 플레이스홀더, 스켈레톤, 에러 처리 포함
- 📱 **반응형 미리보기**: 다양한 뷰포트에서 컴포넌트 확인
- ⚡ **성능 최적화**: 디바운싱과 CSS 변수 기반 애니메이션
- 🧩 **모듈러 컴포넌트**: 필요한 컴포넌트만 선택하여 시스템 구성
- 🔧 **개발자 친화적**: TypeScript 지원과 완전한 타입 안전성
- 📚 **실제 서비스 예시**: 프로필, 제품, 블로그 카드 등 완성도 높은 예시
- 📦 **코드 내보내기**: React, Vue, HTML+CSS 등 다중 형식으로 코드 생성
- 🔗 **GitHub 연동**: 자동 저장소 생성 및 파일 푸시
- 📋 **문서 자동화**: README, CHANGELOG, API 문서 자동 생성

## 시작하기

### 환경 설정

이 프로젝트는 Supabase 데이터베이스를 사용합니다. 다음 단계를 따라 환경을 설정하세요:

1. **Supabase 프로젝트 생성**
   - [Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요
   - 프로젝트 URL과 anon key를 복사하세요

2. **환경 변수 설정**
   프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **데이터베이스 스키마 설정**
   - Supabase 대시보드에서 SQL 에디터를 열고
   - `database.types.ts`에 정의된 테이블 구조를 생성하세요

### 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

[http://localhost:3000](http://localhost:3000)을 브라우저에서 열어 결과를 확인하세요.

## 사용법

### 1. 실시간 테마 편집

컴포넌트 페이지에서 테마 에디터를 사용하여 실시간으로 테마를 편집할 수 있습니다:

```json
{
  "colors": {
    "primary": "#8b5cf6",
    "secondary": "#64748b",
    "background": "#ffffff",
    "foreground": "#0f172a"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif"
  }
}
```

### 2. 컴포넌트 미리보기

- **뷰포트 변경**: 📱(모바일), 📱(태블릿), 💻(데스크톱), 🖥️(와이드)
- **확대/축소**: +/- 키 또는 버튼으로 스케일 조정
- **도구**: 격자(Ctrl+G), 자(Ctrl+R), 풀스크린(Ctrl+Enter)

### 3. 코드 내보내기

코드 내보내기 탭에서 다양한 형식으로 디자인 시스템을 내보낼 수 있습니다:

#### 지원 형식
- **React**: TypeScript 기반 React 컴포넌트
- **Vue**: Vue 3 Composition API 컴포넌트
- **HTML+CSS**: 순수 HTML과 CSS 코드
- **TypeScript**: 타입 정의 및 인터페이스
- **CSS**: CSS 변수 및 스타일
- **Storybook**: 컴포넌트 스토리 파일

#### 내보내기 옵션
- **ZIP 다운로드**: 전체 시스템을 압축 파일로 다운로드
- **GitHub 연동**: 자동 저장소 생성 및 파일 푸시
- **NPM 패키지**: package.json 및 관련 파일 생성
- **개별 복사**: 컴포넌트별 코드를 클립보드에 복사

### 4. 키보드 단축키

#### 테마 에디터
- `Ctrl + S`: 테마 저장 및 적용
- `Ctrl + Z`: 이전 상태로 되돌리기
- `Ctrl + F`: JSON 포맷팅

#### 미리보기
- `1-3`: 컴포넌트 선택 (프로필/제품/블로그)
- `+/-`: 확대/축소
- `Ctrl + G`: 격자 표시 토글
- `Ctrl + R`: 자 표시 토글
- `Ctrl + Enter`: 풀스크린 토글

## 프로젝트 구조

```
src/
├── app/                           # Next.js 앱 라우터
│   ├── components/                # 컴포넌트 데모 페이지
│   ├── globals.css                # 글로벌 스타일 (테마 애니메이션 포함)
│   ├── layout.tsx                 # 루트 레이아웃
│   └── page.tsx                   # 홈페이지
├── components/                    # 컴포넌트 폴더
│   ├── design-system/             # 디자인 시스템 관련 컴포넌트
│   │   ├── ThemeEditor.tsx        # 실시간 테마 에디터
│   │   ├── ComponentPreviewEnhanced.tsx # 고급 컴포넌트 미리보기
│   │   ├── CodeExporter.tsx       # 코드 내보내기 시스템
│   │   └── GitHubSetup.tsx        # GitHub 연동 설정
│   ├── examples/                  # 실제 서비스 예시 컴포넌트
│   │   ├── ProfileCard.tsx        # 프로필 카드 예시
│   │   ├── ProductCard.tsx        # 제품 카드 예시
│   │   ├── BlogCard.tsx           # 블로그 카드 예시
│   │   └── LoadingStates.tsx      # 로딩 상태 및 스켈레톤
│   └── ui/                        # 기본 UI 컴포넌트들
│       ├── Image.tsx              # 이미지 컴포넌트 (플레이스홀더 지원)
│       ├── Avatar.tsx             # 아바타 컴포넌트
│       ├── Card.tsx               # 카드 컴포넌트
│       └── LoadingSpinner.tsx     # 로딩 스피너
├── contexts/                      # React 컨텍스트
│   ├── DesignSystemContext.tsx    # 디자인 시스템 컨텍스트 (테마 엔진 통합)
│   └── ThemeContext.tsx           # 다크/라이트 모드 컨텍스트
├── lib/                           # 유틸리티 함수들
│   ├── themeValidator.ts          # 테마 검증 시스템
│   ├── themeEngine.ts             # 실시간 테마 엔진
│   ├── imageUtils.ts              # 이미지 유틸리티 및 플레이스홀더
│   ├── themeGenerator.ts          # 테마 생성기
│   ├── codeGenerator.ts           # 코드 생성 시스템
│   ├── exportUtils.ts             # 내보내기 유틸리티
│   ├── githubUtils.ts             # GitHub API 연동
│   ├── utils.ts                   # 일반 유틸리티
│   └── variants.ts                # 컴포넌트 변형 정의
└── types/                         # TypeScript 타입 정의
```

## 컴포넌트 카테고리

### 핵심 컴포넌트 (필수)
- Button
- Input
- Card
- Typography

### 이미지 & 미디어
- **Image**: 플레이스홀더, 로딩, 에러 처리
- **Avatar**: 다양한 크기, 상태 배지, 자동 이니셜
- Video
- Gallery
- Carousel

### 실제 서비스 예시
- **ProfileCard**: 소셜 미디어 스타일 프로필
- **ProductCard**: 이커머스 제품 카드
- **BlogCard**: 블로그/뉴스 카드

### 폼 컴포넌트
- Checkbox
- Radio
- Select
- Textarea

### 데이터 표시
- Table
- List
- Badge
- Tooltip

### 피드백 & 로딩
- Alert
- Toast
- Notification
- **LoadingSpinner**: 다양한 스타일의 로딩 애니메이션
- **SkeletonUI**: 컴포넌트별 스켈레톤 로딩

### 레이아웃
- Modal/Dialog
- Navigation
- Grid
- Flex
- Container
- Divider

### 내비게이션
- Tabs
- Pagination
- Steps
- Menu

### 인터랙티브
- Accordion
- Collapse
- Drawer
- Popover

### 차트
- Bar Chart
- Line Chart
- Pie Chart
- Area Chart

## 고급 기능

### 테마 검증 시스템

```typescript
import { ThemeValidator } from '@/lib/themeValidator'

const result = ThemeValidator.validate(jsonTheme, defaultTheme)
if (result.isValid) {
  // 테마 적용
  applyTheme(result.theme)
} else {
  // 오류 처리
  console.log(result.errors)
}
```

### 실시간 테마 엔진

```typescript
import { ThemeEngine } from '@/lib/themeEngine'

const engine = ThemeEngine.getInstance(defaultTheme)
engine.updateTheme(newTheme, true) // 애니메이션과 함께 적용
engine.rollback() // 이전 상태로 롤백
```

### 이미지 유틸리티

```typescript
import { ImageGenerator, SAMPLE_IMAGES } from '@/lib/imageUtils'

// Unsplash 이미지
const natureImage = ImageGenerator.unsplash({
  width: 400,
  height: 300,
  category: 'nature'
})

// 아바타 생성
const avatar = ImageGenerator.avatar('사용자명')

// 테마에 맞춘 플레이스홀더
const placeholder = ImageGenerator.themeAware({
  width: 200,
  height: 150,
  text: 'Loading...',
  primaryColor: '#8b5cf6'
})
```

### 코드 생성 및 내보내기

```typescript
import { CodeGenerator } from '@/lib/codeGenerator'
import { ExportUtils } from '@/lib/exportUtils'

// 코드 생성기 초기화
const codeGenerator = new CodeGenerator(theme, selectedComponents)

// React 코드 생성
const reactCode = codeGenerator.generateFullCode().react

// 개별 컴포넌트 코드 생성
const buttonCode = codeGenerator.generateButtonCode()

// 내보내기 유틸리티
const exportUtils = new ExportUtils(theme, components, generatedCode)

// GitHub 저장소용 파일 구조 생성
const files = exportUtils.generateGitHubStructure()

// NPM 패키지용 package.json 생성
const packageJson = exportUtils.generatePackageJson()
```

### GitHub 연동

```typescript
import { GitHubUtils } from '@/lib/githubUtils'

const githubUtils = new GitHubUtils({
  token: 'your-github-token',
  owner: 'username',
  repo: 'design-system'
}, exportUtils)

// 디자인 시스템을 GitHub에 푸시
const repoUrl = await githubUtils.pushDesignSystem(
  'my-design-system',
  '현대적인 디자인 시스템 컴포넌트 라이브러리',
  false
)
```

## 성능 최적화

### 디바운싱
- JSON 입력: 500ms 디바운싱으로 실시간 검증
- 테마 적용: 불필요한 리렌더링 방지

### CSS 변수 기반 애니메이션
- JavaScript 기반 스타일 조작 최소화
- 네이티브 CSS 전환 활용
- 60fps 부드러운 애니메이션

### 이미지 최적화
- 지연 로딩 및 플레이스홀더
- 자동 에러 처리 및 대체 이미지
- 반응형 이미지 소스 생성

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 기여하기

1. 프로젝트를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 라이선스

MIT License

## 지원

문제가 발생하거나 질문이 있으시면 [이슈](https://github.com/your-username/design-system-generator/issues)를 생성해 주세요.