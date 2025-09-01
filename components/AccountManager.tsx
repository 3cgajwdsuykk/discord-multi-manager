'use client'

import { useState } from 'react'

interface Account {
  id: string
  token: string
  username: string
  discriminator: string
  avatar: string
  isConnected: boolean
  guilds: any[]
}

interface AccountManagerProps {
  accounts: Account[]
  setAccounts: (accounts: Account[]) => void
  selectedAccount: string | null
  setSelectedAccount: (id: string | null) => void
}

export default function AccountManager({ 
  accounts, 
  setAccounts, 
  selectedAccount, 
  setSelectedAccount 
}: AccountManagerProps) {
  const [newToken, setNewToken] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const addAccount = async () => {
    if (!newToken.trim()) return
    
    setIsAdding(true)
    
    try {
      const response = await fetch('/api/discord/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: newToken }),
      })

      if (response.ok) {
        const accountData = await response.json()
        const newAccount: Account = {
          id: accountData.id,
          token: newToken,
          username: accountData.username,
          discriminator: accountData.discriminator,
          avatar: accountData.avatar,
          isConnected: true,
          guilds: accountData.guilds || []
        }
        
        setAccounts([...accounts, newAccount])
        setNewToken('')
        
        if (!selectedAccount) {
          setSelectedAccount(newAccount.id)
        }
      } else {
        const error = await response.json()
        alert(`Failed to connect: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to connect account')
    } finally {
      setIsAdding(false)
    }
  }

  const removeAccount = async (accountId: string) => {
    try {
      await fetch('/api/discord/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      })
      
      setAccounts(accounts.filter(acc => acc.id !== accountId))
      
      if (selectedAccount === accountId) {
        setSelectedAccount(accounts.length > 1 ? accounts[0]?.id || null : null)
      }
    } catch (error) {
      alert('Failed to remove account')
    }
  }

  const disconnectAccount = async (accountId: string) => {
    try {
      await fetch('/api/discord/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      })
      
      setAccounts(accounts.map(acc => 
        acc.id === accountId ? { ...acc, isConnected: false } : acc
      ))
    } catch (error) {
      alert('Failed to disconnect account')
    }
  }

  const reconnectAccount = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    if (!account) return
    
    try {
      const response = await fetch('/api/discord/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: account.token }),
      })

      if (response.ok) {
        setAccounts(accounts.map(acc => 
          acc.id === accountId ? { ...acc, isConnected: true } : acc
        ))
      } else {
        alert('Failed to reconnect account')
      }
    } catch (error) {
      alert('Failed to reconnect account')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Account */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
        <div className="flex space-x-3">
          <input
            type="password"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Enter Discord token..."
            className="input-field flex-1"
          />
          <button
            onClick={addAccount}
            disabled={isAdding || !newToken.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add Account'}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Enter your Discord user token to connect an account
        </p>
      </div>

      {/* Account List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-400">No accounts connected yet</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`p-4 rounded-lg border ${
                  selectedAccount === account.id
                    ? 'border-discord-blurple bg-discord-dark'
                    : 'border-gray-600 bg-discord-dark'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={account.avatar ? `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png` : '/default-avatar.png'}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-white">
                        {account.username}#{account.discriminator}
                      </div>
                      <div className="text-sm text-gray-400">
                        {account.guilds.length} servers
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.isConnected 
                        ? 'bg-discord-green text-black' 
                        : 'bg-discord-red text-white'
                    }`}>
                      {account.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    
                    <button
                      onClick={() => setSelectedAccount(account.id)}
                      className="btn-secondary text-sm"
                    >
                      Select
                    </button>
                    
                    {account.isConnected ? (
                      <button
                        onClick={() => disconnectAccount(account.id)}
                        className="btn-secondary text-sm"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => reconnectAccount(account.id)}
                        className="btn-primary text-sm"
                      >
                        Reconnect
                      </button>
                    )}
                    
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="btn-danger text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
