import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { userId, rating, comment } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    await designSystemService.rateDesignSystem(resolvedParams.id, userId, rating, comment)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error rating design system:', error)
    return NextResponse.json(
      { error: 'Failed to rate design system' },
      { status: 500 }
    )
  }
}