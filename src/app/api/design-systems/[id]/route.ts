import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined

    const designSystem = await designSystemService.getDesignSystem(params.id, userId)

    if (!designSystem) {
      return NextResponse.json(
        { error: 'Design system not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(designSystem)
  } catch (error) {
    console.error('Error fetching design system:', error)
    return NextResponse.json(
      { error: 'Failed to fetch design system' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, designSystemData, changelog } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await designSystemService.updateDesignSystem(
      params.id,
      designSystemData,
      userId,
      changelog
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating design system:', error)
    return NextResponse.json(
      { error: 'Failed to update design system' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await designSystemService.deleteDesignSystem(params.id, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting design system:', error)
    return NextResponse.json(
      { error: 'Failed to delete design system' },
      { status: 500 }
    )
  }
}