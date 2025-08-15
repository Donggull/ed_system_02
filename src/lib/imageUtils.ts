// 다양한 플레이스홀더 이미지 서비스
export const PLACEHOLDER_SERVICES = {
  // Unsplash - 고품질 실제 이미지
  unsplash: {
    base: 'https://source.unsplash.com',
    categories: {
      nature: 'nature',
      city: 'city',
      technology: 'technology',
      business: 'business',
      food: 'food',
      people: 'people',
      abstract: 'abstract',
      animals: 'animals'
    }
  },
  // Picsum - Lorem Ipsum for photos
  picsum: {
    base: 'https://picsum.photos',
    effects: {
      grayscale: '?grayscale',
      blur: '?blur=2'
    }
  },
  // Placeholder.com - 심플한 플레이스홀더
  placeholder: {
    base: 'https://via.placeholder.com'
  }
}

export interface ImageOptions {
  width: number
  height: number
  category?: keyof typeof PLACEHOLDER_SERVICES.unsplash.categories
  text?: string
  backgroundColor?: string
  textColor?: string
  blur?: boolean
  grayscale?: boolean
  quality?: number
}

export class ImageGenerator {
  // Unsplash 이미지 URL 생성
  static unsplash(options: ImageOptions): string {
    const { width, height, category = 'nature' } = options
    const categoryPath = PLACEHOLDER_SERVICES.unsplash.categories[category]
    return `${PLACEHOLDER_SERVICES.unsplash.base}/${width}x${height}/?${categoryPath}`
  }

  // Picsum 이미지 URL 생성
  static picsum(options: ImageOptions): string {
    const { width, height, blur = false, grayscale = false } = options
    let url = `${PLACEHOLDER_SERVICES.picsum.base}/${width}/${height}`
    
    const effects = []
    if (grayscale) effects.push('grayscale')
    if (blur) effects.push('blur=2')
    
    if (effects.length > 0) {
      url += `?${effects.join('&')}`
    }
    
    return url
  }

  // 심플한 플레이스홀더 이미지 URL 생성
  static placeholder(options: ImageOptions): string {
    const { 
      width, 
      height, 
      text = 'Image', 
      backgroundColor = 'e2e8f0', 
      textColor = '64748b' 
    } = options
    
    return `${PLACEHOLDER_SERVICES.placeholder.base}/${width}x${height}/${backgroundColor}/${textColor}?text=${encodeURIComponent(text)}`
  }

  // 프로필 아바타 생성 (DiceBear API)
  static avatar(name: string, style: 'avataaars' | 'identicon' | 'initials' = 'avataaars'): string {
    const seed = encodeURIComponent(name)
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
  }

  // 테마 색상에 맞춘 플레이스홀더 생성
  static themeAware(options: ImageOptions & { primaryColor?: string }): string {
    const { primaryColor = '#2563eb' } = options
    const bgColor = primaryColor.replace('#', '')
    const lightBg = this.lightenColor(bgColor, 80)
    const darkText = this.darkenColor(bgColor, 40)
    
    return this.placeholder({
      ...options,
      backgroundColor: lightBg,
      textColor: darkText
    })
  }

  // 색상 밝게 만들기
  private static lightenColor(color: string, percent: number): string {
    const num = parseInt(color, 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16)
      .slice(1)
  }

  // 색상 어둡게 만들기
  private static darkenColor(color: string, percent: number): string {
    const num = parseInt(color, 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    
    return (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B))
      .toString(16)
      .slice(1)
  }
}

// 미리 정의된 샘플 이미지 데이터
export const SAMPLE_IMAGES = {
  profiles: [
    {
      name: 'Sarah Johnson',
      avatar: ImageGenerator.avatar('Sarah Johnson'),
      cover: ImageGenerator.unsplash({ width: 400, height: 128, category: 'nature' })
    },
    {
      name: '김민수',
      avatar: ImageGenerator.avatar('김민수'),
      cover: ImageGenerator.unsplash({ width: 400, height: 128, category: 'city' })
    },
    {
      name: 'Alex Chen',
      avatar: ImageGenerator.avatar('Alex Chen'),
      cover: ImageGenerator.unsplash({ width: 400, height: 128, category: 'abstract' })
    }
  ],
  products: [
    {
      title: '무선 이어폰',
      image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'technology' }),
      category: '전자제품'
    },
    {
      title: '아메리카노',
      image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'food' }),
      category: '음료'
    },
    {
      title: '노트북',
      image: ImageGenerator.unsplash({ width: 400, height: 300, category: 'business' }),
      category: '컴퓨터'
    }
  ],
  blogs: [
    {
      title: 'React 개발 가이드',
      cover: ImageGenerator.unsplash({ width: 400, height: 200, category: 'technology' }),
      author: {
        name: '개발자 김',
        avatar: ImageGenerator.avatar('개발자 김')
      }
    },
    {
      title: '여행 후기',
      cover: ImageGenerator.unsplash({ width: 400, height: 200, category: 'nature' }),
      author: {
        name: '여행러버',
        avatar: ImageGenerator.avatar('여행러버')
      }
    },
    {
      title: '요리 레시피',
      cover: ImageGenerator.unsplash({ width: 400, height: 200, category: 'food' }),
      author: {
        name: '셰프 박',
        avatar: ImageGenerator.avatar('셰프 박')
      }
    }
  ]
}

// 이미지 로딩 상태 관리
export class ImageLoadingManager {
  private static loadingStates = new Map<string, boolean>()
  private static errorStates = new Map<string, boolean>()

  static setLoading(src: string, loading: boolean) {
    this.loadingStates.set(src, loading)
  }

  static isLoading(src: string): boolean {
    return this.loadingStates.get(src) || false
  }

  static setError(src: string, error: boolean) {
    this.errorStates.set(src, error)
  }

  static hasError(src: string): boolean {
    return this.errorStates.get(src) || false
  }

  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      this.setLoading(src, true)
      
      img.onload = () => {
        this.setLoading(src, false)
        this.setError(src, false)
        resolve()
      }
      
      img.onerror = () => {
        this.setLoading(src, false)
        this.setError(src, true)
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
    })
  }

  static async preloadImages(sources: string[]): Promise<void> {
    const promises = sources.map(src => this.preloadImage(src))
    await Promise.allSettled(promises)
  }
}

// 반응형 이미지 소스 생성
export function generateResponsiveImageSources(
  baseUrl: string,
  sizes: { width: number; height: number }[]
): { src: string; srcSet: string } {
  const srcSet = sizes
    .map(({ width, height }) => `${baseUrl}/${width}x${height} ${width}w`)
    .join(', ')
  
  const defaultSize = sizes[Math.floor(sizes.length / 2)]
  const src = `${baseUrl}/${defaultSize.width}x${defaultSize.height}`
  
  return { src, srcSet }
}
