import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined
    const searchQuery = searchParams.get('q') || undefined
    const sortBy = (searchParams.get('sort') as any) || 'updated_at'
    const userId = searchParams.get('userId') || undefined

    if (userId) {
      // 사용자의 디자인 시스템 목록
      const systems = await designSystemService.getUserDesignSystems(userId)
      return NextResponse.json({ systems, total: systems.length })
    } else {
      // 공개 디자인 시스템 목록
      const result = await designSystemService.getPublicDesignSystems(
        page,
        limit,
        category,
        tags,
        searchQuery,
        sortBy
      )
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Error fetching design systems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch design systems' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, designSystemData } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const designSystemId = await designSystemService.saveDesignSystem(
      designSystemData,
      userId
    )

    return NextResponse.json({ id: designSystemId }, { status: 201 })
  } catch (error) {
    console.error('Error saving design system:', error)
    return NextResponse.json(
      { error: 'Failed to save design system' },
      { status: 500 }
    )
  }
}