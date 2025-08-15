'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Image from '@/components/ui/Image'
import Avatar from '@/components/ui/Avatar'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card'
import LoadingSpinner, { LoadingDots } from '@/components/ui/LoadingSpinner'
import ProfileCard from '@/components/examples/ProfileCard'
import ProductCard from '@/components/examples/ProductCard'
import BlogCard from '@/components/examples/BlogCard'
import {
  ProfileCardSkeleton,
  ProductCardSkeleton,
  BlogCardSkeleton,
  PageLoading
} from '@/components/examples/LoadingStates'
import { SAMPLE_IMAGES, ImageGenerator } from '@/lib/imageUtils'
import ThemeEditor from '@/components/design-system/ThemeEditor'
import ComponentPreviewEnhanced from '@/components/design-system/ComponentPreviewEnhanced'
import { DesignSystemProvider } from '@/contexts/DesignSystemContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

function ComponentsPageContent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [showSkeletons, setShowSkeletons] = useState(true)
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set())

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // 점진적 섹션 로딩
  useEffect(() => {
    if (!isInitialLoading) {
      const sections = ['basic', 'examples', 'advanced']
      sections.forEach((section, index) => {
        setTimeout(() => {
          setLoadedSections(prev => new Set([...prev, section]))
          if (index === sections.length - 1) {
            setTimeout(() => setShowSkeletons(false), 500)
          }
        }, (index + 1) * 800)
      })
    }
  }, [isInitialLoading])

  if (isInitialLoading) {
    return (
      <PageLoading 
        title="디자인 시스템 로딩 중..."
        description="컴포넌트들을 준비하고 있습니다."
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            디자인 시스템 컴포넌트
          </h1>
          <p className="text-lg text-muted-foreground">
            Next.js + Tailwind CSS로 구축된 완전한 디자인 시스템의 컴포넌트들을 확인해보세요.
          </p>
        </div>

        {/* Button Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Button 컴포넌트</h2>
          
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" iconOnly>🔍</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Input 컴포넌트</h2>
          
          <div className="space-y-6">
            {/* Basic Inputs */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Basic Inputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="기본 입력 필드" />
                <Input type="email" placeholder="이메일 입력" />
                <Input type="password" placeholder="비밀번호 입력" />
                <Input type="search" placeholder="검색어 입력" />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Sizes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input size="sm" placeholder="Small size" />
                <Input size="default" placeholder="Default size" />
                <Input size="lg" placeholder="Large size" />
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">States</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="에러 상태" 
                  error="이 필드는 필수입니다"
                />
                <Input 
                  placeholder="성공 상태" 
                  success="입력이 완료되었습니다"
                />
                <Input 
                  placeholder="도움말 텍스트" 
                  helperText="8자 이상 입력해주세요"
                />
                <Input 
                  placeholder="비활성화" 
                  disabled 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Badge Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Badge 컴포넌트</h2>
          
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="default">Default</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            {/* Interactive */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Interactive</h3>
              <div className="flex flex-wrap gap-3">
                <Badge clickable onClick={() => alert('Badge clicked!')}>
                  Clickable Badge
                </Badge>
                <Badge variant="outline" clickable onClick={() => alert('Outline badge clicked!')}>
                  Clickable Outline
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Image Components */}
        {loadedSections.has('basic') && (
          <section className="mb-12 transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold text-foreground mb-6">이미지 컴포넌트</h2>
            
            <div className="space-y-6">
              {/* Basic Images */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">기본 이미지</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Image
                      src={ImageGenerator.unsplash({ width: 200, height: 150, category: 'nature' })}
                      alt="자연"
                      className="w-full h-24"
                      rounded
                    />
                    <p className="text-xs text-muted-foreground text-center">자연</p>
                  </div>
                  <div className="space-y-2">
                    <Image
                      src={ImageGenerator.unsplash({ width: 200, height: 150, category: 'technology' })}
                      alt="기술"
                      className="w-full h-24"
                      rounded
                    />
                    <p className="text-xs text-muted-foreground text-center">기술</p>
                  </div>
                  <div className="space-y-2">
                    <Image
                      src={ImageGenerator.unsplash({ width: 200, height: 150, category: 'food' })}
                      alt="음식"
                      className="w-full h-24"
                      rounded
                    />
                    <p className="text-xs text-muted-foreground text-center">음식</p>
                  </div>
                  <div className="space-y-2">
                    <Image
                      src={ImageGenerator.unsplash({ width: 200, height: 150, category: 'city' })}
                      alt="도시"
                      className="w-full h-24"
                      rounded
                    />
                    <p className="text-xs text-muted-foreground text-center">도시</p>
                  </div>
                </div>
              </div>

              {/* Avatar Components */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">아바타 컴포넌트</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar
                    src={ImageGenerator.avatar('사용자1')}
                    alt="사용자1"
                    size="xs"
                  />
                  <Avatar
                    src={ImageGenerator.avatar('사용자2')}
                    alt="사용자2"
                    size="sm"
                    showBadge
                    badgeColor="green"
                  />
                  <Avatar
                    src={ImageGenerator.avatar('사용자3')}
                    alt="사용자3"
                    size="md"
                    showBadge
                    badgeColor="red"
                  />
                  <Avatar
                    src={ImageGenerator.avatar('사용자4')}
                    alt="사용자4"
                    size="lg"
                    showBadge
                    badgeColor="blue"
                  />
                  <Avatar
                    alt="김민수"
                    size="xl"
                    fallback="김민"
                  />
                </div>
              </div>

              {/* Loading States */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">로딩 상태</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-muted-foreground">Small</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="md" />
                    <span className="text-sm text-muted-foreground">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="lg" />
                    <span className="text-sm text-muted-foreground">Large</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingDots />
                    <span className="text-sm text-muted-foreground">Dots</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Example Cards */}
        {loadedSections.has('examples') && (
          <section className="mb-12 transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold text-foreground mb-6">실제 서비스 예시</h2>
            
            <div className="space-y-8">
              {/* Profile Cards */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">프로필 카드</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showSkeletons ? (
                    <>                     
                      <ProfileCardSkeleton />
                      <ProfileCardSkeleton />
                      <ProfileCardSkeleton />
                    </>
                  ) : (
                    SAMPLE_IMAGES.profiles.map((profile, index) => (
                      <ProfileCard
                        key={index}
                        name={profile.name}
                        title={index === 0 ? 'UX 디자이너' : index === 1 ? '프론트엔드 개발자' : '제품 매니저'}
                        avatar={profile.avatar}
                        coverImage={profile.cover}
                        followers={Math.floor(Math.random() * 10000) + 1000}
                        following={Math.floor(Math.random() * 1000) + 100}
                        posts={Math.floor(Math.random() * 500) + 50}
                        bio={index === 0 ? '사용자 경험을 통해 세상을 더 나은 곳으로 만들어갑니다.' : 
                             index === 1 ? '아름다운 인터페이스를 만드는 것을 좋아합니다.' :
                             '혁신적인 제품을 만들어 사용자들에게 가치를 전달합니다.'}
                        verified={index === 0}
                        badges={index === 0 ? ['디자인', '리더십'] : index === 1 ? ['React', 'TypeScript', 'Next.js'] : ['PM', '전략', '분석']}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Product Cards */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">제품 카드</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showSkeletons ? (
                    <>
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                    </>
                  ) : (
                    [
                      {
                        title: '프리미엄 무선 이어폰',
                        description: '고급 노이즈 캔슬링과 최고 음질을 제공하는 무선 이어폰입니다.',
                        price: 129000,
                        originalPrice: 159000,
                        image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'technology' }),
                        rating: 4.8,
                        reviewCount: 1247,
                        discount: 19,
                        inStock: true,
                        category: '전자제품',
                        tags: ['무선', '노이즈캔슬링', '고음질']
                      },
                      {
                        title: '스페셜티 원두 커피',
                        description: '에티오피아 단일 원산지의 프리미엄 원두로 만든 특별한 커피입니다.',
                        price: 25000,
                        image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'food' }),
                        rating: 4.6,
                        reviewCount: 523,
                        inStock: true,
                        category: '음료',
                        tags: ['원두', '에티오피아', '핸드드립']
                      },
                      {
                        title: '게이밍 노트북',
                        description: '최신 그래픽 카드와 고성능 프로세서를 탑재한 게이밍 노트북입니다.',
                        price: 1299000,
                        originalPrice: 1450000,
                        image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'business' }),
                        rating: 4.5,
                        reviewCount: 89,
                        discount: 10,
                        inStock: false,
                        category: '컴퓨터',
                        tags: ['게이밍', '고성능', 'RTX']
                      }
                    ].map((product, index) => (
                      <ProductCard key={index} {...product} />
                    ))
                  )}
                </div>
              </div>

              {/* Blog Cards */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">블로그 카드</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showSkeletons ? (
                    <>
                      <BlogCardSkeleton />
                      <BlogCardSkeleton />
                      <BlogCardSkeleton />
                    </>
                  ) : (
                    [
                      {
                        title: 'React 18의 새로운 기능들: Concurrent Features 완전 정복',
                        excerpt: 'React 18에서 도입된 Concurrent Features를 활용하여 더 나은 사용자 경험을 만드는 방법을 알아보겠습니다. Suspense, useTransition, useDeferredValue 등의 새로운 기능들을 실제 예제와 함께 살펴보세요.',
                        coverImage: ImageGenerator.unsplash({ width: 400, height: 200, category: 'technology' }),
                        author: {
                          name: '리액트 개발자',
                          avatar: ImageGenerator.avatar('리액트 개발자')
                        },
                        publishedAt: '2024-01-15T10:00:00Z',
                        readTime: 8,
                        category: '개발',
                        tags: ['React', 'JavaScript', 'Frontend'],
                        likes: 342,
                        comments: 28,
                        featured: true
                      },
                      {
                        title: '제주도 3박 4일 완벽 여행 가이드',
                        excerpt: '제주도의 숨겨진 명소부터 유명한 관광지까지, 3박 4일 동안 제주도를 완벽하게 즐길 수 있는 여행 코스를 소개합니다. 맛집 정보와 숙소 추천도 함께 제공합니다.',
                        coverImage: ImageGenerator.unsplash({ width: 400, height: 200, category: 'nature' }),
                        author: {
                          name: '여행 블로거',
                          avatar: ImageGenerator.avatar('여행 블로거')
                        },
                        publishedAt: '2024-01-10T14:30:00Z',
                        readTime: 12,
                        category: '여행',
                        tags: ['제주도', '여행', '관광'],
                        likes: 789,
                        comments: 156
                      },
                      {
                        title: '집에서 만드는 이탈리안 파스타의 모든 것',
                        excerpt: '이탈리아 현지에서 배운 정통 파스타 레시피를 공개합니다. 면 만들기부터 소스 제조까지, 집에서도 레스토랑 수준의 파스타를 만들 수 있는 비법을 전수합니다.',
                        coverImage: ImageGenerator.unsplash({ width: 400, height: 200, category: 'food' }),
                        author: {
                          name: '홈쿡 셰프',
                          avatar: ImageGenerator.avatar('홈쿡 셰프')
                        },
                        publishedAt: '2024-01-08T16:45:00Z',
                        readTime: 6,
                        category: '요리',
                        tags: ['파스타', '이탈리안', '레시피'],
                        likes: 234,
                        comments: 67
                      }
                    ].map((blog, index) => (
                      <BlogCard key={index} {...blog} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Theme Editor */}
        {loadedSections.has('advanced') && (
          <section className="mb-12 transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold text-foreground mb-6">실시간 테마 에디터</h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
              <ThemeEditor className="xl:col-span-1" />
              <ComponentPreviewEnhanced className="xl:col-span-1" />
            </div>
          </section>
        )}

        {/* Advanced Usage Examples */}
        {loadedSections.has('advanced') && (
          <section className="mb-12 transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-semibold text-foreground mb-6">고급 사용 예시</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Example */}
              <Card variant="elevated" className="p-6">
                <CardHeader>
                  <h3 className="text-lg font-medium text-foreground">사용자 등록 폼</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      alt="프로필 사진"
                      size="lg"
                      fallback="+"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
              <div>
                      <p className="text-sm font-medium text-foreground">프로필 사진</p>
                      <p className="text-xs text-muted-foreground">클릭하여 이미지 업로드</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                  <Input 
                      placeholder="이름"
                    leftIcon={<span className="text-muted-foreground">👤</span>}
                  />
                    <Input 
                      placeholder="성"
                    />
                  </div>
                  
                  <Input 
                    type="email" 
                    placeholder="이메일 주소"
                    leftIcon={<span className="text-muted-foreground">📧</span>}
                  />
                  
                  <Input 
                    type="password" 
                    placeholder="비밀번호"
                    leftIcon={<span className="text-muted-foreground">🔒</span>}
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" size="sm" clickable>개발자</Badge>
                    <Badge variant="outline" size="sm" clickable>디자이너</Badge>
                    <Badge variant="outline" size="sm" clickable>기획자</Badge>
                    <Badge variant="outline" size="sm" clickable>마케터</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    회원가입
                  </Button>
                  <Button variant="outline" className="flex-1">
                    취소
                  </Button>
                </CardFooter>
              </Card>

              {/* Dashboard Example */}
              <Card variant="elevated" className="p-6">
                <CardHeader>
                  <h3 className="text-lg font-medium text-foreground">대시보드 위젯</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">1,234</div>
                      <div className="text-sm text-muted-foreground">총 사용자</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">89%</div>
                      <div className="text-sm text-muted-foreground">만족도</div>
                </div>
              </div>
              
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">최근 활동</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                          <Avatar
                            src={ImageGenerator.avatar(`사용자${item}`)}
                            alt={`사용자${item}`}
                            size="sm"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">사용자{item}님이 댓글을 작성했습니다</p>
                            <p className="text-xs text-muted-foreground">{item}분 전</p>
                          </div>
                          <Badge variant="secondary" size="sm">새로움</Badge>
                        </div>
                      ))}
              </div>
            </div>
                </CardContent>
              </Card>
          </div>
        </section>
        )}
      </div>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <ThemeProvider>
      <DesignSystemProvider>
        <ComponentsPageContent />
      </DesignSystemProvider>
    </ThemeProvider>
  )
}
