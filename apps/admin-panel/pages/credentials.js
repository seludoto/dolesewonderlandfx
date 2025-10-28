import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  Key,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Copy
} from 'lucide-react'

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [showPassword, setShowPassword] = useState({})
  const [formData, setFormData] = useState({
    user_id: '',
    broker: '',
    account_type: 'demo',
    api_key: '',
    api_secret: '',
    server: '',
    leverage: 100,
    balance: 0,
    status: 'active'
  })

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      // In a real app, this would call an admin API endpoint
      // For now, we'll use mock data
      const mockCredentials = [
        {
          id: 1,
          user_id: 2,
          user_email: 'trader@example.com',
          broker: 'MetaTrader 5',
          account_type: 'demo',
          server: 'MetaQuotes-Demo',
          leverage: 100,
          balance: 10000,
          status: 'active',
          created_at: '2025-10-20T10:00:00Z',
          last_used: '2025-10-25T14:30:00Z'
        },
        {
          id: 2,
          user_id: 3,
          user_email: 'protrader@example.com',
          broker: 'OANDA',
          account_type: 'live',
          server: 'api-fxpractice.oanda.com',
          leverage: 50,
          balance: 50000,
          status: 'active',
          created_at: '2025-09-15T09:15:00Z',
          last_used: '2025-10-24T16:45:00Z'
        }
      ]
      setCredentials(mockCredentials)
    } catch (error) {
      toast.error('Failed to fetch credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCredential = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would call the API
      const newCredential = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString(),
        last_used: null
      }
      setCredentials([...credentials, newCredential])
      setShowCreateModal(false)
      resetForm()
      toast.success('Live credentials created successfully')
    } catch (error) {
      toast.error('Failed to create credentials')
    }
  }

  const handleEditCredential = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would call the API
      setCredentials(credentials.map(cred =>
        cred.id === selectedCredential.id
          ? { ...cred, ...formData }
          : cred
      ))
      setShowEditModal(false)
      setSelectedCredential(null)
      resetForm()
      toast.success('Credentials updated successfully')
    } catch (error) {
      toast.error('Failed to update credentials')
    }
  }

  const handleDeleteCredential = async (credentialId) => {
    if (window.confirm('Are you sure you want to delete these credentials? This action cannot be undone.')) {
      try {
        // In a real app, this would call the API
        setCredentials(credentials.filter(cred => cred.id !== credentialId))
        toast.success('Credentials deleted successfully')
      } catch (error) {
        toast.error('Failed to delete credentials')
      }
    }
  }

  const handleEditClick = (credential) => {
    setSelectedCredential(credential)
    setFormData({
      user_id: credential.user_id,
      broker: credential.broker,
      account_type: credential.account_type,
      api_key: credential.api_key || '',
      api_secret: credential.api_secret || '',
      server: credential.server,
      leverage: credential.leverage,
      balance: credential.balance,
      status: credential.status
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      user_id: '',
      broker: '',
      account_type: 'demo',
      api_key: '',
      api_secret: '',
      server: '',
      leverage: 100,
      balance: 0,
      status: 'active'
    })
  }

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <title>Live Credentials Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Key className="h-8 w-8 mr-3 text-blue-600" />
              Live Trading Credentials
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage live trading credentials for users
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Credentials
            </button>
          </div>
        </div>

        {/* Credentials Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Broker
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Account Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Balance
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Last Used
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {credentials.map((credential) => (
                      <tr key={credential.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{credential.user_email}</div>
                              <div className="text-gray-500">ID: {credential.user_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium">{credential.broker}</span>
                            <span className="ml-2 text-xs text-gray-400">{credential.server}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            credential.account_type === 'live'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {credential.account_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>
                            <div className="font-medium">${credential.balance.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">{credential.leverage}x leverage</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            credential.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {credential.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(credential.last_used)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(credential)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit credentials"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCredential(credential.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete credentials"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

        {/* Create Credential Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                        <Key className="h-5 w-5 mr-2" />
                        Create Live Trading Credentials
                      </h3>
                      <form onSubmit={handleCreateCredential} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                              type="number"
                              required
                              className="input-field mt-1"
                              value={formData.user_id}
                              onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                              placeholder="123"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Broker</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.broker}
                              onChange={(e) => setFormData({...formData, broker: e.target.value})}
                            >
                              <option value="">Select Broker</option>
                              <option value="MetaTrader 5">MetaTrader 5</option>
                              <option value="MetaTrader 4">MetaTrader 4</option>
                              <option value="OANDA">OANDA</option>
                              <option value="Interactive Brokers">Interactive Brokers</option>
                              <option value="TD Ameritrade">TD Ameritrade</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Account Type</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.account_type}
                              onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                            >
                              <option value="demo">Demo</option>
                              <option value="live">Live</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Server</label>
                            <input
                              type="text"
                              required
                              className="input-field mt-1"
                              value={formData.server}
                              onChange={(e) => setFormData({...formData, server: e.target.value})}
                              placeholder="api.broker.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">API Key</label>
                            <div className="relative">
                              <input
                                type={showPassword.api_key ? 'text' : 'password'}
                                required
                                className="input-field mt-1 pr-10"
                                value={formData.api_key}
                                onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                                placeholder="Your API Key"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('api_key')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword.api_key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">API Secret</label>
                            <div className="relative">
                              <input
                                type={showPassword.api_secret ? 'text' : 'password'}
                                required
                                className="input-field mt-1 pr-10"
                                value={formData.api_secret}
                                onChange={(e) => setFormData({...formData, api_secret: e.target.value})}
                                placeholder="Your API Secret"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('api_secret')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword.api_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Leverage</label>
                            <input
                              type="number"
                              required
                              className="input-field mt-1"
                              value={formData.leverage}
                              onChange={(e) => setFormData({...formData, leverage: parseInt(e.target.value)})}
                              min="1"
                              max="1000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
                            <input
                              type="number"
                              required
                              className="input-field mt-1"
                              value={formData.balance}
                              onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                        </div>

                        {formData.account_type === 'live' && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="flex">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                  Live Trading Credentials
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                  <p>Ensure these credentials are correct. Live trading involves real financial risk.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    onClick={handleCreateCredential}
                    className="btn-primary ml-3"
                  >
                    Create Credentials
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Credential Modal */}
        {showEditModal && selectedCredential && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Trading Credentials
                      </h3>
                      <form onSubmit={handleEditCredential} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Broker</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.broker}
                              onChange={(e) => setFormData({...formData, broker: e.target.value})}
                            >
                              <option value="MetaTrader 5">MetaTrader 5</option>
                              <option value="MetaTrader 4">MetaTrader 4</option>
                              <option value="OANDA">OANDA</option>
                              <option value="Interactive Brokers">Interactive Brokers</option>
                              <option value="TD Ameritrade">TD Ameritrade</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Account Type</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.account_type}
                              onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                            >
                              <option value="demo">Demo</option>
                              <option value="live">Live</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Server</label>
                          <input
                            type="text"
                            required
                            className="input-field mt-1"
                            value={formData.server}
                            onChange={(e) => setFormData({...formData, server: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">API Key</label>
                            <div className="relative">
                              <input
                                type={showPassword.edit_api_key ? 'text' : 'password'}
                                required
                                className="input-field mt-1 pr-10"
                                value={formData.api_key}
                                onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('edit_api_key')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword.edit_api_key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">API Secret</label>
                            <div className="relative">
                              <input
                                type={showPassword.edit_api_secret ? 'text' : 'password'}
                                required
                                className="input-field mt-1 pr-10"
                                value={formData.api_secret}
                                onChange={(e) => setFormData({...formData, api_secret: e.target.value})}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('edit_api_secret')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword.edit_api_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Leverage</label>
                            <input
                              type="number"
                              required
                              className="input-field mt-1"
                              value={formData.leverage}
                              onChange={(e) => setFormData({...formData, leverage: parseInt(e.target.value)})}
                              min="1"
                              max="1000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Balance</label>
                            <input
                              type="number"
                              required
                              className="input-field mt-1"
                              value={formData.balance}
                              onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              required
                              className="input-field mt-1"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    onClick={handleEditCredential}
                    className="btn-primary ml-3"
                  >
                    Update Credentials
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedCredential(null)
                      resetForm()
                    }}
                  >
                    Cancel
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