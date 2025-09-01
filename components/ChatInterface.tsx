'use client'

import { useState, useEffect } from 'react'

interface ChatInterfaceProps {
  accounts: any[]
  selectedAccount: string | null
}

export default function ChatInterface({ accounts, selectedAccount }: ChatInterfaceProps) {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [guilds, setGuilds] = useState<any[]>([])
  const [channels, setChannels] = useState<any[]>([])

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount)

  useEffect(() => {
    if (selectedAccountData) {
      setGuilds(selectedAccountData.guilds || [])
      setSelectedGuild(null)
      setSelectedChannel(null)
      setMessages([])
    }
  }, [selectedAccountData])

  useEffect(() => {
    if (selectedGuild) {
      fetchChannels(selectedGuild)
    }
  }, [selectedGuild])

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel)
    }
  }, [selectedChannel])

  const fetchChannels = async (guildId: string) => {
    if (!selectedAccount) return
    
    try {
      const response = await fetch(`/api/discord/channels?guildId=${guildId}&accountId=${selectedAccount}`)
      if (response.ok) {
        const channelsData = await response.json()
        setChannels(channelsData)
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    }
  }

  const fetchMessages = async (channelId: string) => {
    if (!selectedAccount) return
    
    try {
      const response = await fetch(`/api/discord/messages?channelId=${channelId}&accountId=${selectedAccount}`)
      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !selectedChannel || !selectedAccount) return
    
    try {
      const response = await fetch('/api/discord/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: selectedChannel,
          accountId: selectedAccount,
          message: message.trim()
        }),
      })

      if (response.ok) {
        setMessage('')
        // Refresh messages
        fetchMessages(selectedChannel)
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      alert('Failed to send message')
    }
  }

  if (!selectedAccount) {
    return (
      <div className="card">
        <p className="text-gray-400">Please select an account to start chatting</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
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

      {/* Channels Sidebar */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Channels</h3>
        {selectedGuild ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  selectedChannel === channel.id
                    ? 'bg-discord-blurple text-white'
                    : 'hover:bg-discord-dark text-gray-300'
                }`}
              >
                <span className="truncate">#{channel.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Select a server to view channels</p>
        )}
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Chat</h3>
          {selectedChannel && (
            <span className="text-sm text-gray-400">
              {channels.find(c => c.id === selectedChannel)?.name}
            </span>
          )}
        </div>

        {selectedChannel ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-discord-darker rounded">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex space-x-2">
                    <img
                      src={msg.author.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : '/default-avatar.png'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{msg.author.username}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="input-field flex-1"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
