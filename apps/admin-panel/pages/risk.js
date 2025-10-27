import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Mail
} from 'lucide-react'

export default function RiskPage() {
  const [riskAlerts, setRiskAlerts] = useState([])
  const [userRiskProfiles, setUserRiskProfiles] = useState([])
  const [systemRiskMetrics, setSystemRiskMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [alertFilter, setAlertFilter] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showAlertModal, setShowAlertModal] = useState(false)

  useEffect(() => {
    fetchRiskData()
  }, [])

  const fetchRiskData = async () => {
    try {
      // Mock risk management data
      const mockRiskAlerts = [
        {
          id: 1,
          userId: 2,
          username: 'trader123',
          type: 'margin_call',
          severity: 'critical',
          message: 'Margin call triggered - Account balance insufficient',
          currentMargin: 150,
          requiredMargin: 200,
          positionValue: 15000,
          status: 'active',
          createdAt: '2025-10-27T14:30:00Z',
          actions: ['force_close_positions', 'notify_user', 'suspend_trading']
        },
        {
          id: 2,
          userId: 3,
          username: 'high_risk_trader',
          type: 'concentration_risk',
          severity: 'high',
          message: 'High concentration in single asset (85% of portfolio)',
          asset: 'BTC/USD',
          concentration: 85,
          recommendedLimit: 50,
          status: 'active',
          createdAt: '2025-10-27T13:15:00Z',
          actions: ['reduce_position', 'set_limits', 'notify_user']
        },
        {
          id: 3,
          userId: 4,
          username: 'new_trader',
          type: 'leverage_risk',
          severity: 'medium',
          message: 'Excessive leverage usage (500x) on small account',
          leverage: 500,
          accountBalance: 500,
          positionSize: 250000,
          status: 'active',
          createdAt: '2025-10-27T12:45:00Z',
          actions: ['reduce_leverage', 'set_max_leverage', 'monitor_closely']
        },
        {
          id: 4,
          userId: 5,
          username: 'day_trader',
          type: 'loss_limit',
          severity: 'high',
          message: 'Daily loss limit exceeded (80% of account)',
          dailyLoss: 800,
          dailyLimit: 1000,
          accountBalance: 1000,
          status: 'resolved',
          createdAt: '2025-10-27T11:20:00Z',
          resolvedAt: '2025-10-27T11:30:00Z',
          actions: ['suspend_trading', 'require_verification']
        }
      ]

      const mockUserRiskProfiles = [
        {
          userId: 2,
          username: 'trader123',
          riskScore: 85,
          riskLevel: 'high',
          accountBalance: 1500,
          openPositions: 3,
          totalExposure: 15000,
          marginUsed: 75,
          dailyPnL: -250,
          winRate: 65,
          avgTradeSize: 5000,
          maxDrawdown: 15
        },
        {
          userId: 3,
          username: 'high_risk_trader',
          riskScore: 92,
          riskLevel: 'extreme',
          accountBalance: 5000,
          openPositions: 2,
          totalExposure: 42500,
          marginUsed: 85,
          dailyPnL: 1200,
          winRate: 78,
          avgTradeSize: 21250,
          maxDrawdown: 25
        },
        {
          userId: 4,
          username: 'new_trader',
          riskScore: 45,
          riskLevel: 'medium',
          accountBalance: 500,
          openPositions: 1,
          totalExposure: 250000,
          marginUsed: 50,
          dailyPnL: -50,
          winRate: 40,
          avgTradeSize: 250000,
          maxDrawdown: 10
        }
      ]

      const mockSystemMetrics = {
        totalUsers: 1250,
        activeTraders: 340,
        totalExposure: 2500000,
        systemMarginUsed: 68,
        criticalAlerts: 3,
        highAlerts: 12,
        mediumAlerts: 25,
        marketVolatility: 0.75,
        systemHealth: 98.5
      }

      setRiskAlerts(mockRiskAlerts)
      setUserRiskProfiles(mockUserRiskProfiles)
      setSystemRiskMetrics(mockSystemMetrics)
    } catch (error) {
      toast.error('Failed to fetch risk data')
    } finally {
      setLoading(false)
    }
  }

  const filteredAlerts = riskAlerts.filter(alert => {
    const matchesSearch = alert.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = alertFilter === 'all' || alert.severity === alertFilter
    return matchesSearch && matchesFilter
  })

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert)
    setShowAlertModal(true)
  }

  const handleResolveAlert = async (alertId) => {
    try {
      setRiskAlerts(riskAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString() }
          : alert
      ))
      toast.success('Alert resolved successfully')
    } catch (error) {
      toast.error('Failed to resolve alert')
    }
  }

  const handleActionAlert = async (alertId, action) => {
    try {
      // In a real app, this would call the API for the specific action
      toast.success(`Action "${action}" executed successfully`)
    } catch (error) {
      toast.error(`Failed to execute action: ${action}`)
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'extreme': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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
        <title>Risk Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Risk Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor and manage trading risks, margin calls, and user risk profiles
            </p>
          </div>
        </div>

        {/* System Risk Overview */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Critical Alerts
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {systemRiskMetrics.criticalAlerts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    System Margin Used
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {systemRiskMetrics.systemMarginUsed}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Exposure
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ${(systemRiskMetrics.totalExposure / 1000000).toFixed(1)}M
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    System Health
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {systemRiskMetrics.systemHealth}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alerts Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Risk Alerts</h2>
            <span className="text-sm text-gray-500">
              {filteredAlerts.filter(a => a.status === 'active').length} active alerts
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="input-field"
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Alert
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Severity
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-2">{alert.message}</div>
                          <div className="text-gray-500 text-xs">{alert.type.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {alert.username}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {alert.type.replace('_', ' ')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(alert.createdAt)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewAlert(alert)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {alert.status === 'active' && (
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
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

        {/* User Risk Profiles */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">High Risk User Profiles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userRiskProfiles.map((profile) => (
              <div key={profile.userId} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{profile.username}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(profile.riskLevel)}`}>
                    {profile.riskLevel}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Risk Score:</span>
                    <span className="text-sm font-medium">{profile.riskScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Balance:</span>
                    <span className="text-sm font-medium">{formatCurrency(profile.accountBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Exposure:</span>
                    <span className="text-sm font-medium">{formatCurrency(profile.totalExposure)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Margin Used:</span>
                    <span className="text-sm font-medium">{profile.marginUsed}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Daily P&L:</span>
                    <span className={`text-sm font-medium ${profile.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(profile.dailyPnL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Win Rate:</span>
                    <span className="text-sm font-medium">{profile.winRate}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Max Drawdown</span>
                    <span className="text-xs font-medium text-red-600">{profile.maxDrawdown}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Detail Modal */}
        {showAlertModal && selectedAlert && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Risk Alert Details
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                          {selectedAlert.severity}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User</label>
                            <p className="text-sm text-gray-900">{selectedAlert.username}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedAlert.type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedAlert.status}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Created</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedAlert.createdAt)}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Alert Message</label>
                          <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{selectedAlert.message}</p>
                        </div>

                        {selectedAlert.type === 'margin_call' && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Margin Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Current Margin:</span> {formatCurrency(selectedAlert.currentMargin)}
                              </div>
                              <div>
                                <span className="text-gray-500">Required Margin:</span> {formatCurrency(selectedAlert.requiredMargin)}
                              </div>
                              <div>
                                <span className="text-gray-500">Position Value:</span> {formatCurrency(selectedAlert.positionValue)}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedAlert.actions && selectedAlert.actions.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Available Actions</h4>
                            <div className="space-y-2">
                              {selectedAlert.actions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleActionAlert(selectedAlert.id, action)}
                                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-800"
                                >
                                  {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowAlertModal(false)
                      setSelectedAlert(null)
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