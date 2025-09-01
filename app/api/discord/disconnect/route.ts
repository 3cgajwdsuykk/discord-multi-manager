import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Find the stored client instance for this account
    // 2. Disconnect it from voice channels
    // 3. Destroy the client
    // 4. Remove it from storage

    // For now, we'll just return success
    // In production, implement proper client management
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Discord disconnection error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect from Discord' },
      { status: 500 }
    )
  }
}
