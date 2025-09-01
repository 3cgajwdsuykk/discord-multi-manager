'use client'

import { useState, useRef } from 'react'

interface AudioPlayerProps {
  accounts: any[]
  selectedAccount: string | null
}

export default function AudioPlayer({ accounts, selectedAccount }: AudioPlayerProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [audioQueue, setAudioQueue] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const connectedAccounts = accounts.filter(acc => acc.isConnected)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
    } else {
      alert('Please select a valid audio file')
    }
  }

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  const selectAllAccounts = () => {
    setSelectedAccounts(connectedAccounts.map(acc => acc.id))
  }

  const deselectAllAccounts = () => {
    setSelectedAccounts([])
  }

  const playAudio = async () => {
    if (!audioFile || selectedAccounts.length === 0) {
      alert('Please select an audio file and at least one account')
      return
    }

    setIsPlaying(true)

    try {
      // Convert file to base64 for transmission
      const reader = new FileReader()
      reader.onload = async () => {
        const base64Audio = reader.result as string
        
        // Send audio to all selected accounts
        const promises = selectedAccounts.map(accountId =>
          fetch('/api/discord/play-audio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accountId,
              audioData: base64Audio,
              volume: volume / 100
            }),
          })
        )

        try {
          await Promise.all(promises)
          console.log('Audio sent to all selected accounts')
        } catch (error) {
          console.error('Failed to send audio to some accounts:', error)
          alert('Failed to send audio to some accounts')
        }
      }
      
      reader.readAsDataURL(audioFile)
    } catch (error) {
      console.error('Failed to play audio:', error)
      alert('Failed to play audio')
    } finally {
      setIsPlaying(false)
    }
  }

  const stopAudio = async () => {
    if (selectedAccounts.length === 0) return

    try {
      const promises = selectedAccounts.map(accountId =>
        fetch('/api/discord/stop-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountId }),
        })
      )

      await Promise.all(promises)
      setIsPlaying(false)
      console.log('Audio stopped on all accounts')
    } catch (error) {
      console.error('Failed to stop audio:', error)
      alert('Failed to stop audio')
    }
  }

  const addToQueue = () => {
    if (audioFile && !audioQueue.includes(audioFile.name)) {
      setAudioQueue(prev => [...prev, audioFile.name])
    }
  }

  const removeFromQueue = (index: number) => {
    setAudioQueue(prev => prev.filter((_, i) => i !== index))
  }

  const playQueue = async () => {
    if (audioQueue.length === 0 || selectedAccounts.length === 0) return
    
    setIsPlaying(true)
    
    // This would implement queue playback logic
    alert('Queue playback feature coming soon!')
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      {/* Audio File Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Audio File</h3>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
          >
            Select Audio File
          </button>
          {audioFile && (
            <div className="flex-1">
              <span className="text-white">{audioFile.name}</span>
              <span className="text-gray-400 ml-2">
                ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Account Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Select Accounts</h3>
        <div className="flex space-x-2 mb-4">
          <button onClick={selectAllAccounts} className="btn-secondary text-sm">
            Select All
          </button>
          <button onClick={deselectAllAccounts} className="btn-secondary text-sm">
            Deselect All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className={`p-3 border rounded cursor-pointer transition-colors ${
                selectedAccounts.includes(account.id)
                  ? 'border-discord-blurple bg-discord-blurple bg-opacity-20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => toggleAccountSelection(account.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => {}}
                  className="w-4 h-4 text-discord-blurple"
                />
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
                    {selectedAccounts.includes(account.id) ? 'Selected' : 'Not selected'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Control */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Volume Control</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Volume:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 bg-discord-dark rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white w-12">{volume}%</span>
        </div>
      </div>

      {/* Audio Queue */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Audio Queue</h3>
        <div className="flex space-x-2 mb-4">
          <button onClick={addToQueue} className="btn-secondary text-sm">
            Add to Queue
          </button>
          <button onClick={playQueue} className="btn-primary text-sm">
            Play Queue
          </button>
        </div>
        <div className="space-y-2">
          {audioQueue.map((fileName, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-discord-darker rounded">
              <span className="text-white">{fileName}</span>
              <button
                onClick={() => removeFromQueue(index)}
                className="btn-danger text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {audioQueue.length === 0 && (
            <p className="text-gray-400 text-center">No audio files in queue</p>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Playback Controls</h3>
        <div className="flex space-x-4">
          <button
            onClick={playAudio}
            disabled={!audioFile || selectedAccounts.length === 0 || isPlaying}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? 'Playing...' : 'Play Audio'}
          </button>
          
          <button
            onClick={stopAudio}
            disabled={selectedAccounts.length === 0 || !isPlaying}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop Audio
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-discord-darker rounded">
          <p className="text-sm text-gray-400">
            <strong>Note:</strong> Audio will be played through all selected accounts that are currently in voice channels.
            Make sure the accounts are connected to voice channels before playing audio.
          </p>
        </div>
      </div>

      {/* Status Display */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Selected Accounts:</span>
            <span className="text-white">{selectedAccounts.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Connected Accounts:</span>
            <span className="text-white">{connectedAccounts.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Audio File:</span>
            <span className="text-white">{audioFile ? 'Selected' : 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Queue Length:</span>
            <span className="text-white">{audioQueue.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
