import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'
import { useState } from 'react'

const apiKeys = [
  {
    id: 1,
    name: 'Trading Bot API',
    service: 'Alpaca Markets',
    created: '2024-01-15',
    lastUsed: '2024-01-20',
    status: 'active',
    permissions: ['read', 'trade']
  },
  {
    id: 2,
    name: 'Data Feed API',
    service: 'Alpha Vantage',
    created: '2024-01-10',
    lastUsed: '2024-01-19',
    status: 'active',
    permissions: ['read']
  },
  {
    id: 3,
    name: 'Analytics API',
    service: 'TradingView',
    created: '2024-01-05',
    lastUsed: '2024-01-18',
    status: 'inactive',
    permissions: ['read', 'write']
  }
]

const integrations = [
  {
    name: 'Alpaca Markets',
    description: 'Commission-free API for trading stocks and crypto',
    status: 'connected',
    endpoints: 12,
    rateLimit: '200/min'
  },
  {
    name: 'Alpha Vantage',
    description: 'Free APIs for realtime and historical stock data',
    status: 'connected',
    endpoints: 8,
    rateLimit: '5/min'
  },
  {
    name: 'TradingView',
    description: 'Advanced charting and technical analysis platform',
    status: 'disconnected',
    endpoints: 0,
    rateLimit: 'N/A'
  },
  {
    name: 'Binance API',
    description: 'Cryptocurrency trading platform API',
    status: 'available',
    endpoints: 0,
    rateLimit: 'N/A'
  }
]

export default function ApiManagementPage() {
  const [showKey, setShowKey] = useState({})

  const toggleKeyVisibility = (id) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <InstructorLayout>
      <Head>
        <title>API Management - Instructor Portal</title>
        <meta name="description" content="Manage API keys and external service integrations" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <span className="text-3xl mr-3">☁️</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage API keys, integrations, and external service connections
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">➕</span>
                <span className="text-sm font-medium text-gray-900">New API Key</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">☁️</span>
                <span className="text-sm font-medium text-gray-900">Add Integration</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">📄</span>
                <span className="text-sm font-medium text-gray-900">API Docs</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">🔄</span>
                <span className="text-sm font-medium text-gray-900">Test Connection</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Keys */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                API Keys
              </h3>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🔑</span>
                        <h4 className="text-sm font-medium text-gray-900">{key.name}</h4>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{key.service}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
                      <div>Created: {key.created}</div>
                      <div>Last used: {key.lastUsed}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((perm) => (
                          <span key={perm} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {perm}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showKey[key.id] ? <span className="text-sm">🙈</span> : <span className="text-sm">👁️</span>}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <span className="text-sm">🗑️</span>
                        </button>
                      </div>
                    </div>
                    {showKey[key.id] && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs font-mono text-gray-800">
                        sk-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Service Integrations
              </h3>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        integration.status === 'connected'
                          ? 'bg-green-100 text-green-800'
                          : integration.status === 'available'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
                      <div>Endpoints: {integration.endpoints}</div>
                      <div>Rate Limit: {integration.rateLimit}</div>
                    </div>
                    <div className="flex justify-end">
                      {integration.status === 'connected' ? (
                        <button className="text-sm text-red-600 hover:text-red-500 font-medium">
                          Disconnect
                        </button>
                      ) : integration.status === 'available' ? (
                        <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                          Connect
                        </button>
                      ) : (
                        <button className="text-sm text-gray-600 hover:text-gray-500 font-medium">
                          Reconnect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API Usage Stats */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              API Usage Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2,847</div>
                <div className="text-sm text-gray-600">Total Requests</div>
                <div className="text-xs text-green-600 mt-1">+12% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-xs text-green-600 mt-1">+0.2% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">156ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-xs text-red-600 mt-1">-8ms from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">23</div>
                <div className="text-sm text-gray-600">Active Keys</div>
                <div className="text-xs text-green-600 mt-1">+3 from last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Features */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-2">
              PRO
            </span>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Advanced API Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Webhook Management</h4>
              <p className="text-sm text-gray-600">Set up real-time notifications for trading events and market data updates.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Rate Limit Monitoring</h4>
              <p className="text-sm text-gray-600">Advanced analytics and alerts for API usage and rate limits.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Custom Endpoints</h4>
              <p className="text-sm text-gray-600">Create custom API endpoints tailored to your trading strategies.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">OAuth Integration</h4>
              <p className="text-sm text-gray-600">Secure third-party authentication and authorization flows.</p>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}