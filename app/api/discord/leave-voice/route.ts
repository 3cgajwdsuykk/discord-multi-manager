import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Find the stored client instance for this account
    // 2. Use it to leave the voice channel
    // 3. Handle voice connection cleanup

    // For now, we'll just return success
    // In production, implement proper client management and voice channel leaving
    console.log(`Account ${accountId} leaving voice channel`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Discord voice leave error:', error)
    return NextResponse.json(
      { error: 'Failed to leave voice channel' },
      { status: 500 }
    )
  }
}
