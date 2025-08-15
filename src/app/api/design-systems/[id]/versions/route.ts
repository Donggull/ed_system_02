import { NextRequest, NextResponse } from 'next/server'
import { designSystemService } from '@/lib/designSystemService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined

    const versions = await designSystemService.getVersionHistory(resolvedParams.id, userId)

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching version history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    )
  }
}