import { NextRequest, NextResponse } from 'next/server'
import { Client, GatewayIntentBits } from 'discord.js'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Create Discord client
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    })

    // Login with token
    await client.login(token)

    // Get user info
    const user = client.user
    if (!user) {
      await client.destroy()
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get guilds (servers)
    const guilds = await client.guilds.fetch()

    // Store client instance for later use (in production, use a proper storage solution)
    // For now, we'll just return the user info and guilds
    await client.destroy()

    return NextResponse.json({
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      guilds: Array.from(guilds.values()).map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
      }))
    })

  } catch (error) {
    console.error('Discord connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Discord' },
      { status: 500 }
    )
  }
}
