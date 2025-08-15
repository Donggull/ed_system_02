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
    "secondary": "#06b6d4",
    "background": "#ffffff",
    "foreground": "#0f172a",
    "muted": "#f1f5f9",
    "accent": "#f59e0b",
    "destructive": "#ef4444",
    "border": "#e2e8f0",
    "input": "#f8fafc",
    "ring": "#8b5cf6"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  }
}
```

### 2. 컴포넌트 선택 및 구성

사이드바에서 원하는 컴포넌트를 선택하고 개별 설정을 조정할 수 있습니다:

- **Button**: 크기, 변형, 아이콘 포함 여부
- **Card**: 이미지, 헤더, 푸터 포함 여부
- **Input**: 플레이스홀더, 라벨, 도움말 텍스트
- **Avatar**: 크기, 대체 이미지, 온라인 상태 표시
- **Badge**: 변형, 크기, 제거 가능 여부
- **LoadingSpinner**: 크기, 색상, 애니메이션 속도

### 3. 미리보기 및 반응형 테스트

캔버스 영역에서 다양한 뷰포트로 테스트할 수 있습니다:

- **모바일** (375px): 스마트폰 화면
- **태블릿** (768px): 태블릿 화면
- **데스크톱** (1024px): 데스크톱 화면
- **와이드** (1440px): 큰 모니터

### 4. 코드 내보내기

"Export" 탭에서 다양한 형식으로 코드를 내보낼 수 있습니다:

- **React**: JSX 컴포넌트 및 Tailwind CSS 클래스
- **Vue**: Vue SFC (Single File Component)
- **HTML + CSS**: 순수 HTML과 CSS
- **TypeScript**: 타입 정의 포함
- **Storybook**: 스토리북 스토리 파일

### 5. GitHub 연동

코드 내보내기 시 GitHub 저장소로 직접 푸시할 수 있습니다:

1. GitHub 토큰 설정
2. 새 저장소 생성 또는 기존 저장소 선택
3. 브랜치 선택
4. 커밋 메시지 작성
5. 자동 파일 생성 및 푸시

## 컴포넌트 상세

### Button 컴포넌트

```tsx
import { Button } from '@/components/ui/Button'

// 기본 사용법
<Button>클릭하세요</Button>

// 변형 및 크기
<Button variant="outline" size="lg">큰 아웃라인 버튼</Button>
<Button variant="destructive" size="sm">작은 위험 버튼</Button>

// 로딩 상태
<Button isLoading>로딩 중...</Button>

// 비활성화
<Button disabled>비활성화됨</Button>
```

### Card 컴포넌트

```tsx
import { Card } from '@/components/ui/Card'

<Card>
  <Card.Header>
    <Card.Title>카드 제목</Card.Title>
    <Card.Description>카드 설명</Card.Description>
  </Card.Header>
  <Card.Content>
    카드 내용
  </Card.Content>
  <Card.Footer>
    <Button>액션</Button>
  </Card.Footer>
</Card>
```

### Input 컴포넌트

```tsx
import { Input } from '@/components/ui/Input'

// 기본 사용법
<Input placeholder="이름을 입력하세요" />

// 라벨과 도움말
<div>
  <label htmlFor="email">이메일</label>
  <Input id="email" type="email" placeholder="이메일 주소" />
  <p className="text-sm text-muted-foreground">올바른 이메일 주소를 입력하세요</p>
</div>

// 에러 상태
<Input error placeholder="에러 상태" />
```

### Image 컴포넌트

```tsx
import { Image } from '@/components/ui/Image'

// 기본 사용법
<Image 
  src="/path/to/image.jpg" 
  alt="이미지 설명" 
  width={400} 
  height={300} 
/>

// 플레이스홀더 서비스
<Image 
  placeholder="unsplash" 
  category="nature"
  width={400} 
  height={300} 
/>

// 스켈레톤 로딩
<Image 
  src="/slow-loading-image.jpg"
  alt="느린 이미지"
  showSkeleton
  width={400}
  height={300}
/>

// 에러 대체 이미지
<Image 
  src="/non-existent-image.jpg"
  alt="없는 이미지"
  fallback="/default-image.jpg"
  width={400}
  height={300}
/>
```

### Avatar 컴포넌트

```tsx
import { Avatar } from '@/components/ui/Avatar'

// 기본 사용법
<Avatar src="/user-avatar.jpg" alt="사용자" />

// 크기 변형
<Avatar src="/user.jpg" alt="사용자" size="lg" />

// 온라인 상태 표시
<Avatar src="/user.jpg" alt="사용자" showOnline />

// 자동 생성 아바타
<Avatar seed="john-doe" alt="John Doe" />

// 대체 텍스트
<Avatar fallback="JD" alt="John Doe" />
```

### Badge 컴포넌트

```tsx
import { Badge } from '@/components/ui/Badge'

// 기본 사용법
<Badge>새로운</Badge>

// 변형
<Badge variant="secondary">보조</Badge>
<Badge variant="destructive">위험</Badge>
<Badge variant="outline">아웃라인</Badge>

// 제거 가능
<Badge removable onRemove={() => console.log('제거됨')}>제거 가능</Badge>
```

### LoadingSpinner 컴포넌트

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// 기본 사용법
<LoadingSpinner />

// 크기 및 색상
<LoadingSpinner size="lg" className="text-primary" />

// 텍스트와 함께
<div className="flex items-center space-x-2">
  <LoadingSpinner size="sm" />
  <span>로딩 중...</span>
</div>
```

## 고급 사용법

### 테마 커스터마이징

테마는 CSS 변수를 통해 런타임에 동적으로 변경됩니다:

```css
:root {
  --primary: 139 92 246;
  --secondary: 6 182 212;
  --background: 255 255 255;
  --foreground: 15 23 42;
  /* ... 기타 변수들 */
}

.dark {
  --background: 15 23 42;
  --foreground: 248 250 252;
  /* ... 다크 모드 변수들 */
}
```

### 컴포넌트 변형 확장

`class-variance-authority`를 사용하여 새로운 변형을 추가할 수 있습니다:

```tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        // 새 변형 추가
        gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        // 새 크기 추가
        xl: 'h-14 px-12 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
```

### 이미지 서비스 확장

새로운 플레이스홀더 서비스를 추가할 수 있습니다:

```tsx
// lib/imageUtils.ts
export const getPlaceholderUrl = (
  service: 'unsplash' | 'picsum' | 'custom' | 'newservice',
  width: number,
  height: number,
  options?: PlaceholderOptions
): string => {
  switch (service) {
    case 'newservice':
      return `https://newservice.com/${width}x${height}`
    // ... 기존 케이스들
  }
}
```

## 배포

### Vercel에 배포

```bash
npm install -g vercel
vercel
```

### Netlify에 배포

```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### 자체 호스팅

```bash
npm run build
npm start
```

## 기여하기

1. 이 저장소를 포크하세요
2. 새 기능 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 지원

문제가 발생하거나 기능 요청이 있으시면 [GitHub Issues](https://github.com/your-username/design-system-generator/issues)에 등록해 주세요.

## 감사의 말

- [Next.js](https://nextjs.org/) - 리액트 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Lucide Icons](https://lucide.dev/) - 아이콘 라이브러리
- [class-variance-authority](https://github.com/joe-bell/cva) - 타입 세이프 변형 API
- [Unsplash](https://unsplash.com/) - 무료 이미지 서비스
- [DiceBear](https://dicebear.com/) - 아바타 생성 서비스
- [Supabase](https://supabase.com/) - 오픈소스 백엔드 서비스

---

**Design System Generator**로 더 나은 디자인 시스템을 만들어보세요! 🎨✨