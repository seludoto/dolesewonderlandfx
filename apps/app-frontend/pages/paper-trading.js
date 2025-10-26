import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MultiAssetTrading from '../components/MultiAssetTrading'
import SocialTrading from '../components/SocialTrading'

export default function PaperTrading() {
  const [activeTab, setActiveTab] = useState('trading')
  const [userId, setUserId] = useState('user123') // In a real app, this would come from authentication
  const [accountId, setAccountId] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [userId])

  const fetchAccounts = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll simulate having accounts
      setAccounts([
        {
          id: 'acc123',
          balance: 10000,
          account_currency: 'USD',
          leverage: 100,
          allowed_asset_types: ['forex', 'stock', 'crypto', 'commodity', 'index']
        }
      ])
      setAccountId('acc123')
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const createAccount = async (accountData) => {
    try {
      // In a real implementation, this would call the API
      const newAccount = {
        id: 'acc' + Date.now(),
        ...accountData,
        balance: accountData.initial_balance,
        equity: accountData.initial_balance,
        margin_used: 0,
        free_margin: accountData.initial_balance,
        total_pnl: 0,
        created_at: new Date().toISOString(),
        status: 'active',
        trading_stats: {
          total_trades: 0,
          winning_trades: 0,
          losing_trades: 0,
          win_rate: 0,
          avg_win: 0,
          avg_loss: 0,
          largest_win: 0,
          largest_loss: 0
        }
      }
      setAccounts([...accounts, newAccount])
      setAccountId(newAccount.id)
      setShowCreateAccount(false)
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const tabs = [
    { id: 'trading', label: 'Multi-Asset Trading', icon: '📈' },
    { id: 'social', label: 'Social Trading', icon: '👥' },
    { id: 'ai', label: 'AI Analysis', icon: '🤖' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Paper Trading - DoleSe Wonderland FX</title>
        <meta name="description" content="Advanced multi-asset paper trading with social features" />
      </Head>

      <ToastContainer position="top-right" autoClose={3000} />

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">DoleSe Wonderland FX</h1>
            <div className="flex items-center space-x-4">
              <select
                value={accountId || ''}
                onChange={(e) => setAccountId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    Account {account.id.slice(-4)} - ${account.balance?.toFixed(2)} ({account.leverage}x)
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCreateAccount(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'trading' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Multi-Asset Paper Trading</h2>
              <p className="text-gray-600">
                Trade forex, stocks, crypto, commodities, and indices with advanced order types and risk management.
              </p>
            </div>
            <MultiAssetTrading accountId={accountId} />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Social Trading Network</h2>
              <p className="text-gray-600">
                Follow top traders, copy their strategies, and climb the leaderboards.
              </p>
            </div>
            <SocialTrading userId={userId} />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">AI-Powered Trading Analysis</h2>
              <p className="text-gray-600">
                Leverage advanced AI for strategy generation, portfolio optimization, and market insights.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 text-center py-8">
                AI Trading Analysis is available on the dedicated <a href="/ai-trading" className="text-blue-600 hover:underline">AI Trading page</a>.
              </p>
              <div className="text-center mt-4">
                <a
                  href="/ai-trading"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold inline-block"
                >
                  Go to AI Trading Analysis
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Account Modal */}
      {showCreateAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Create Paper Trading Account</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              createAccount({
                user_id: userId,
                initial_balance: parseFloat(formData.get('initial_balance')),
                account_currency: formData.get('account_currency'),
                leverage: parseInt(formData.get('leverage')),
                allowed_asset_types: ['forex', 'stock', 'crypto', 'commodity', 'index'] // All asset types for demo
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Balance ($)</label>
                  <input
                    name="initial_balance"
                    type="number"
                    defaultValue="10000"
                    min="100"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Currency</label>
                  <select name="account_currency" className="w-full p-2 border rounded" defaultValue="USD">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Leverage</label>
                  <select name="leverage" className="w-full p-2 border rounded" defaultValue="100">
                    <option value="10">10x</option>
                    <option value="50">50x</option>
                    <option value="100">100x</option>
                    <option value="200">200x</option>
                    <option value="500">500x</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}