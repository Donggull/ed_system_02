import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params
    const designSystem = await designSystemService.getDesignSystemByShareToken(resolvedParams.token)

    if (!designSystem) {
      return NextResponse.json(
        { error: 'Design system not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(designSystem)
  } catch (error) {
    console.error('Error fetching shared design system:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared design system' },
      { status: 500 }
    )
  }
}