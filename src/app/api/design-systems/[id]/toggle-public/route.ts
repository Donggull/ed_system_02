import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, isPublic } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await designSystemService.togglePublic(params.id, userId, isPublic)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling public status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle public status' },
      { status: 500 }
    )
  }
}