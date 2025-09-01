'use client'

import { useState, useEffect } from 'react'

interface VoiceManagerProps {
  accounts: any[]
  selectedAccount: string | null
}

export default function VoiceManager({ accounts, selectedAccount }: VoiceManagerProps) {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const [voiceChannels, setVoiceChannels] = useState<any[]>([])
  const [connectedVoiceChannels, setConnectedVoiceChannels] = useState<{[key: string]: string}>({})
  const [guilds, setGuilds] = useState<any[]>([])

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount)

  useEffect(() => {
    if (selectedAccountData) {
      setGuilds(selectedAccountData.guilds || [])
      setSelectedGuild(null)
      setVoiceChannels([])
    }
  }, [selectedAccountData])

  useEffect(() => {
    if (selectedGuild) {
      fetchVoiceChannels(selectedGuild)
    }
  }, [selectedGuild])

  const fetchVoiceChannels = async (guildId: string) => {
    if (!selectedAccount) return
    
    try {
      const response = await fetch(`/api/discord/voice-channels?guildId=${guildId}&accountId=${selectedAccount}`)
      if (response.ok) {
        const channelsData = await response.json()
        setVoiceChannels(channelsData.filter((ch: any) => ch.type === 2)) // Type 2 = Voice Channel
      }
    } catch (error) {
      console.error('Failed to fetch voice channels:', error)
    }
  }

  const joinVoiceChannel = async (channelId: string) => {
    if (!selectedAccount) return
    
    try {
      const response = await fetch('/api/discord/join-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          accountId: selectedAccount
        }),
      })

      if (response.ok) {
        setConnectedVoiceChannels(prev => ({
          ...prev,
          [selectedAccount]: channelId
        }))
      } else {
        alert('Failed to join voice channel')
      }
    } catch (error) {
      alert('Failed to join voice channel')
    }
  }

  const leaveVoiceChannel = async (accountId: string) => {
    try {
      const response = await fetch('/api/discord/leave-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId
        }),
      })

      if (response.ok) {
        setConnectedVoiceChannels(prev => {
          const newState = { ...prev }
          delete newState[accountId]
          return newState
        })
      } else {
        alert('Failed to leave voice channel')
      }
    } catch (error) {
      alert('Failed to leave voice channel')
    }
  }

  const joinAllAccountsToVoice = async (channelId: string) => {
    const promises = accounts
      .filter(acc => acc.isConnected)
      .map(acc => joinVoiceChannel(channelId))
    
    try {
      await Promise.all(promises)
      // Update all connected accounts to show they're in the same channel
      const newConnectedState: {[key: string]: string} = {}
      accounts.forEach(acc => {
        if (acc.isConnected) {
          newConnectedState[acc.id] = channelId
        }
      })
      setConnectedVoiceChannels(newConnectedState)
    } catch (error) {
      alert('Failed to join all accounts to voice channel')
    }
  }

  if (!selectedAccount) {
    return (
      <div className="card">
        <p className="text-gray-400">Please select an account to manage voice channels</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Channel Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guilds Sidebar */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Servers</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {guilds.map((guild) => (
              <button
                key={guild.id}
                onClick={() => setSelectedGuild(guild.id)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  selectedGuild === guild.id
                    ? 'bg-discord-blurple text-white'
                    : 'hover:bg-discord-dark text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '/default-server.png'}
                    alt="Server Icon"
                    className="w-6 h-6 rounded"
                  />
                  <span className="truncate">{guild.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Voice Channels</h3>
          {selectedGuild ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {voiceChannels.map((channel) => (
                <div key={channel.id} className="p-3 border border-gray-600 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔊</span>
                      <span className="text-white">{channel.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => joinVoiceChannel(channel.id)}
                        className="btn-primary text-sm"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => joinAllAccountsToVoice(channel.id)}
                        className="btn-secondary text-sm"
                      >
                        Join All
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Select a server to view voice channels</p>
          )}
        </div>

        {/* Connected Accounts Status */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Voice Status</h3>
          <div className="space-y-3">
            {accounts.map((account) => {
              const isInVoice = connectedVoiceChannels[account.id]
              const voiceChannel = isInVoice ? voiceChannels.find(ch => ch.id === isInVoice) : null
              
              return (
                <div key={account.id} className="p-3 border border-gray-600 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={account.avatar ? `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png` : '/default-avatar.png'}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {account.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {isInVoice ? `In: ${voiceChannel?.name}` : 'Not in voice'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {isInVoice ? (
                        <button
                          onClick={() => leaveVoiceChannel(account.id)}
                          className="btn-danger text-sm"
                        >
                          Leave
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Disconnected</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              const allConnected = Object.keys(connectedVoiceChannels)
              allConnected.forEach(accountId => leaveVoiceChannel(accountId))
            }}
            className="btn-danger"
          >
            Leave All Voice Channels
          </button>
          
          <button
            onClick={() => {
              // This would implement a feature to move all accounts to the same voice channel
              alert('Feature: Move all accounts to same voice channel')
            }}
            className="btn-secondary"
          >
            Move All to Same Channel
          </button>
        </div>
      </div>
    </div>
  )
}
