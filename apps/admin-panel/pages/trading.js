import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function TradingPage() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [showTradeModal, setShowTradeModal] = useState(false)

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    try {
      // Mock trading data - in a real app, this would come from API
      const mockTrades = [
        {
          id: 1,
          userId: 2,
          username: 'trader123',
          symbol: 'EUR/USD',
          type: 'buy',
          quantity: 10000,
          price: 1.0845,
          currentPrice: 1.0872,
          pnl: 270,
          pnlPercent: 2.49,
          status: 'open',
          openedAt: '2025-10-27T10:30:00Z',
          leverage: 100,
          stopLoss: 1.0750,
          takeProfit: 1.0950
        },
        {
          id: 2,
          userId: 3,
          username: 'crypto_trader',
          symbol: 'BTC/USD',
          type: 'sell',
          quantity: 0.5,
          price: 67500,
          currentPrice: 67200,
          pnl: 150,
          pnlPercent: 0.44,
          status: 'open',
          openedAt: '2025-10-27T09:15:00Z',
          leverage: 50,
          stopLoss: 69000,
          takeProfit: 65000
        },
        {
          id: 3,
          userId: 2,
          username: 'trader123',
          symbol: 'GBP/USD',
          type: 'buy',
          quantity: 5000,
          price: 1.2750,
          currentPrice: 1.2720,
          pnl: -150,
          pnlPercent: -1.18,
          status: 'open',
          openedAt: '2025-10-27T08:45:00Z',
          leverage: 200,
          stopLoss: 1.2650,
          takeProfit: 1.2850
        },
        {
          id: 4,
          userId: 4,
          username: 'forex_master',
          symbol: 'EUR/USD',
          type: 'sell',
          quantity: 25000,
          price: 1.0820,
          currentPrice: 1.0872,
          pnl: -1300,
          pnlPercent: -2.03,
          status: 'open',
          openedAt: '2025-10-26T16:20:00Z',
          leverage: 50,
          stopLoss: 1.0920,
          takeProfit: 1.0720
        },
        {
          id: 5,
          userId: 2,
          username: 'trader123',
          symbol: 'USD/JPY',
          type: 'buy',
          quantity: 100000,
          price: 153.45,
          currentPrice: 153.67,
          pnl: 2200,
          pnlPercent: 0.14,
          status: 'closed',
          openedAt: '2025-10-26T14:30:00Z',
          closedAt: '2025-10-27T11:00:00Z',
          leverage: 25,
          stopLoss: 152.50,
          takeProfit: 154.50
        }
      ]
      setTrades(mockTrades)
    } catch (error) {
      toast.error('Failed to fetch trades')
    } finally {
      setLoading(false)
    }
  }

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewTrade = (trade) => {
    setSelectedTrade(trade)
    setShowTradeModal(true)
  }

  const handleCloseTrade = async (tradeId) => {
    if (window.confirm('Are you sure you want to close this trade?')) {
      try {
        // In a real app, this would call the API
        setTrades(trades.map(trade =>
          trade.id === tradeId
            ? { ...trade, status: 'closed', closedAt: new Date().toISOString() }
            : trade
        ))
        toast.success('Trade closed successfully')
      } catch (error) {
        toast.error('Failed to close trade')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPnlColor = (pnl) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>Trading Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Trading Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor and manage all trading activities on the platform
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Trades
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {trades.filter(t => t.status === 'open').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total P&L
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(trades.reduce((sum, trade) => sum + trade.pnl, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Volume Today
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    $2.4M
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Risk Alerts
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    3
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Trades Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Trade
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        P&L
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Opened
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">{trade.symbol}</div>
                              <div className="text-gray-500">{formatCurrency(trade.price)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {trade.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trade.type === 'buy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {trade.quantity.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className={`font-medium ${getPnlColor(trade.pnl)}`}>
                            {formatCurrency(trade.pnl)}
                          </div>
                          <div className={`text-xs ${getPnlColor(trade.pnl)}`}>
                            ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                            {trade.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(trade.openedAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewTrade(trade)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {trade.status === 'open' && (
                              <button
                                onClick={() => handleCloseTrade(trade.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Detail Modal */}
        {showTradeModal && selectedTrade && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Trade Details - {selectedTrade.symbol}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User</label>
                            <p className="text-sm text-gray-900">{selectedTrade.username}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedTrade.type}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <p className="text-sm text-gray-900">{selectedTrade.quantity.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Leverage</label>
                            <p className="text-sm text-gray-900">{selectedTrade.leverage}x</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Entry Price</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTrade.price)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Current Price</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTrade.currentPrice)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Stop Loss</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTrade.stopLoss)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Take Profit</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTrade.takeProfit)}</p>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Current P&L:</span>
                            <span className={`text-lg font-bold ${getPnlColor(selectedTrade.pnl)}`}>
                              {formatCurrency(selectedTrade.pnl)} ({selectedTrade.pnlPercent >= 0 ? '+' : ''}{selectedTrade.pnlPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowTradeModal(false)
                      setSelectedTrade(null)
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}