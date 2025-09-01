import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guildId = searchParams.get('guildId')
    const accountId = searchParams.get('accountId')

    if (!guildId || !accountId) {
      return NextResponse.json(
        { error: 'Guild ID and Account ID are required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Find the stored client instance for this account
    // 2. Use it to fetch voice channels from the guild

    // For now, we'll return mock data
    // In production, implement proper client management and voice channel fetching
    const mockVoiceChannels = [
      { id: '1', name: 'General Voice', type: 2 },
      { id: '2', name: 'Music Room', type: 2 },
      { id: '3', name: 'Gaming', type: 2 },
      { id: '4', name: 'Chill Zone', type: 2 },
    ]

    return NextResponse.json(mockVoiceChannels)

  } catch (error) {
    console.error('Discord voice channels fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voice channels' },
      { status: 500 }
    )
  }
}
