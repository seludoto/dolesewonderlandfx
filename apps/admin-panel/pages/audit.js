import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  Shield,
  User,
  Settings,
  DollarSign,
  TrendingUp,
  LogIn,
  LogOut,
  Edit,
  Trash2
} from 'lucide-react'

export default function AuditPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState(null)
  const [showLogModal, setShowLogModal] = useState(false)

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      // Mock audit logs data
      const mockLogs = [
        {
          id: 1,
          timestamp: '2025-10-27T14:30:00Z',
          userId: 1,
          username: 'admin',
          userRole: 'admin',
          action: 'user_login',
          resource: 'authentication',
          resourceId: null,
          details: 'Admin logged into the system',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          severity: 'info'
        },
        {
          id: 2,
          timestamp: '2025-10-27T14:25:00Z',
          userId: 2,
          username: 'trader123',
          userRole: 'user',
          action: 'trade_closed',
          resource: 'trading',
          resourceId: 'trade_12345',
          details: 'Closed EUR/USD position with P&L: +$270',
          ipAddress: '10.0.0.50',
          userAgent: 'Trading Platform Mobile App v2.1',
          status: 'success',
          severity: 'info'
        },
        {
          id: 3,
          timestamp: '2025-10-27T14:20:00Z',
          userId: 1,
          username: 'admin',
          userRole: 'admin',
          action: 'user_suspended',
          resource: 'user_management',
          resourceId: 'user_456',
          details: 'Suspended user account due to suspicious activity',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          severity: 'warning'
        },
        {
          id: 4,
          timestamp: '2025-10-27T14:15:00Z',
          userId: 3,
          username: 'crypto_trader',
          userRole: 'user',
          action: 'withdrawal_request',
          resource: 'financial',
          resourceId: 'withdrawal_789',
          details: 'Requested withdrawal of $2500 to bank account ****5678',
          ipAddress: '172.16.0.25',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          status: 'pending',
          severity: 'info'
        },
        {
          id: 5,
          timestamp: '2025-10-27T14:10:00Z',
          userId: 4,
          username: 'forex_master',
          userRole: 'user',
          action: 'password_change',
          resource: 'account',
          resourceId: 'user_101',
          details: 'User changed password successfully',
          ipAddress: '203.0.113.45',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          status: 'success',
          severity: 'info'
        },
        {
          id: 6,
          timestamp: '2025-10-27T14:05:00Z',
          userId: null,
          username: 'system',
          userRole: 'system',
          action: 'margin_call_triggered',
          resource: 'risk_management',
          resourceId: 'user_2',
          details: 'Margin call triggered for trader123 - Current margin: $150, Required: $200',
          ipAddress: '127.0.0.1',
          userAgent: 'Automated Risk Management System',
          status: 'success',
          severity: 'critical'
        },
        {
          id: 7,
          timestamp: '2025-10-27T14:00:00Z',
          userId: 5,
          username: 'new_trader',
          userRole: 'user',
          action: 'login_failed',
          resource: 'authentication',
          resourceId: null,
          details: 'Failed login attempt - Invalid password',
          ipAddress: '198.51.100.15',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'failed',
          severity: 'warning'
        },
        {
          id: 8,
          timestamp: '2025-10-27T13:55:00Z',
          userId: 1,
          username: 'admin',
          userRole: 'admin',
          action: 'settings_changed',
          resource: 'system_settings',
          resourceId: 'leverage_limits',
          details: 'Updated maximum leverage limit from 200x to 500x for VIP users',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          severity: 'warning'
        },
        {
          id: 9,
          timestamp: '2025-10-27T13:50:00Z',
          userId: 2,
          username: 'trader123',
          userRole: 'user',
          action: 'deposit_completed',
          resource: 'financial',
          resourceId: 'deposit_234',
          details: 'Deposit of $1000 completed via credit card ****4242',
          ipAddress: '10.0.0.50',
          userAgent: 'Trading Platform Web App v2.1',
          status: 'success',
          severity: 'info'
        },
        {
          id: 10,
          timestamp: '2025-10-27T13:45:00Z',
          userId: null,
          username: 'system',
          userRole: 'system',
          action: 'backup_completed',
          resource: 'system_maintenance',
          resourceId: null,
          details: 'Daily database backup completed successfully - Size: 2.4GB',
          ipAddress: '127.0.0.1',
          userAgent: 'Automated Backup System',
          status: 'success',
          severity: 'info'
        }
      ]
      setLogs(mockLogs)
    } catch (error) {
      toast.error('Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesUser = userFilter === 'all' || log.username === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const handleViewLog = (log) => {
    setSelectedLog(log)
    setShowLogModal(true)
  }

  const handleExportLogs = () => {
    // In a real app, this would export the filtered logs
    toast.success('Audit logs exported successfully')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_login':
      case 'login_failed':
        return <LogIn className="h-4 w-4" />
      case 'user_logout':
        return <LogOut className="h-4 w-4" />
      case 'trade_closed':
      case 'trade_opened':
        return <TrendingUp className="h-4 w-4" />
      case 'deposit_completed':
      case 'withdrawal_request':
        return <DollarSign className="h-4 w-4" />
      case 'user_suspended':
      case 'password_change':
        return <User className="h-4 w-4" />
      case 'settings_changed':
        return <Settings className="h-4 w-4" />
      case 'margin_call_triggered':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getUniqueUsers = () => {
    const users = [...new Set(logs.map(log => log.username))]
    return users
  }

  const getUniqueActions = () => {
    const actions = [...new Set(logs.map(log => log.action))]
    return actions
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
        <title>Audit Logs - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor system activity, security events, and compliance tracking
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleExportLogs}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Events
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {logs.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Critical Events
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {logs.filter(l => l.severity === 'critical').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Failed Actions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {logs.filter(l => l.status === 'failed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {getUniqueUsers().length}
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="input-field"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {getUniqueActions().map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              {getUniqueUsers().map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Event
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Resource
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Severity
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Timestamp
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getActionIcon(log.action)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900 line-clamp-1">{log.details}</div>
                              <div className="text-gray-500 text-xs">ID: {log.resourceId || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>
                            <div className="font-medium text-gray-900">{log.username}</div>
                            <div className="text-gray-500 text-xs capitalize">{log.userRole}</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                          {log.resource.replace('_', ' ')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleViewLog(log)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Log Detail Modal */}
        {showLogModal && selectedLog && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Audit Log Details
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User</label>
                            <p className="text-sm text-gray-900">{selectedLog.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{selectedLog.userRole}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Action</label>
                            <p className="text-sm text-gray-900">{selectedLog.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Resource</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedLog.resource.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Resource ID</label>
                            <p className="text-sm text-gray-900">{selectedLog.resourceId || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                              {selectedLog.status}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Severity</label>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                              {selectedLog.severity}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Details</label>
                          <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{selectedLog.details}</p>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Technical Information</h4>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Timestamp:</span>
                              <span>{formatDate(selectedLog.timestamp)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">IP Address:</span>
                              <span>{selectedLog.ipAddress}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">User Agent:</span>
                              <span className="text-xs">{selectedLog.userAgent}</span>
                            </div>
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
                      setShowLogModal(false)
                      setSelectedLog(null)
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