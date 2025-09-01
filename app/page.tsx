'use client'

import { useState, useEffect } from 'react'
import AccountManager from '@/components/AccountManager'
import ChatInterface from '@/components/ChatInterface'
import VoiceManager from '@/components/VoiceManager'
import AudioPlayer from '@/components/AudioPlayer'

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'accounts' | 'chat' | 'voice' | 'audio'>('accounts')

  return (
    <div className="min-h-screen bg-discord-darker">
      {/* Header */}
      <header className="bg-discord-dark border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">
              Discord Multi-Account Manager
            </h1>
            <div className="flex space-x-2">
              <span className="text-sm text-gray-300">
                {accounts.length} Account{accounts.length !== 1 ? 's' : ''} Connected
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-discord-dark border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'accounts', label: 'Accounts', icon: '👤' },
              { id: 'chat', label: 'Chat', icon: '💬' },
              { id: 'voice', label: 'Voice', icon: '🎤' },
              { id: 'audio', label: 'Audio', icon: '🎵' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-discord-blurple text-discord-blurple'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'accounts' && (
          <AccountManager 
            accounts={accounts} 
            setAccounts={setAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
          />
        )}
        
        {activeTab === 'chat' && (
          <ChatInterface 
            accounts={accounts}
            selectedAccount={selectedAccount}
          />
        )}
        
        {activeTab === 'voice' && (
          <VoiceManager 
            accounts={accounts}
            selectedAccount={selectedAccount}
          />
        )}
        
        {activeTab === 'audio' && (
          <AudioPlayer 
            accounts={accounts}
            selectedAccount={selectedAccount}
          />
        )}
      </main>
    </div>
  )
}
