import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export default function FinancialPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      // Mock financial transaction data
      const mockTransactions = [
        {
          id: 1,
          userId: 2,
          username: 'trader123',
          type: 'deposit',
          amount: 5000,
          currency: 'USD',
          method: 'bank_transfer',
          status: 'completed',
          createdAt: '2025-10-27T10:00:00Z',
          completedAt: '2025-10-27T10:30:00Z',
          reference: 'DEP-2025-001',
          fee: 0,
          description: 'Bank transfer deposit',
          bankDetails: {
            bankName: 'Chase Bank',
            accountNumber: '****1234',
            routingNumber: '021000021'
          }
        },
        {
          id: 2,
          userId: 3,
          username: 'crypto_trader',
          type: 'withdrawal',
          amount: 2500,
          currency: 'USD',
          method: 'bank_transfer',
          status: 'pending',
          createdAt: '2025-10-27T09:15:00Z',
          reference: 'WD-2025-002',
          fee: 25,
          description: 'Withdrawal to personal account',
          bankDetails: {
            bankName: 'Bank of America',
            accountNumber: '****5678',
            routingNumber: '121000358'
          }
        },
        {
          id: 3,
          userId: 2,
          username: 'trader123',
          type: 'deposit',
          amount: 10000,
          currency: 'USD',
          method: 'credit_card',
          status: 'completed',
          createdAt: '2025-10-26T16:45:00Z',
          completedAt: '2025-10-26T16:50:00Z',
          reference: 'DEP-2025-003',
          fee: 50,
          description: 'Credit card deposit',
          cardDetails: {
            cardType: 'Visa',
            lastFour: '****4242'
          }
        },
        {
          id: 4,
          userId: 4,
          username: 'forex_master',
          type: 'withdrawal',
          amount: 7500,
          currency: 'USD',
          method: 'crypto',
          status: 'processing',
          createdAt: '2025-10-26T14:20:00Z',
          reference: 'WD-2025-004',
          fee: 15,
          description: 'Crypto withdrawal to wallet',
          cryptoDetails: {
            network: 'ERC20',
            address: '0x742d35Cc6...',
            currency: 'USDT'
          }
        },
        {
          id: 5,
          userId: 5,
          username: 'new_trader',
          type: 'deposit',
          amount: 2000,
          currency: 'USD',
          method: 'paypal',
          status: 'failed',
          createdAt: '2025-10-26T11:30:00Z',
          reference: 'DEP-2025-005',
          fee: 0,
          description: 'PayPal deposit',
          errorMessage: 'Payment declined by PayPal'
        }
      ]
      setTransactions(mockTransactions)
    } catch (error) {
      toast.error('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionModal(true)
  }

  const handleApproveTransaction = async (transactionId) => {
    try {
      setTransactions(transactions.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, status: 'completed', completedAt: new Date().toISOString() }
          : transaction
      ))
      toast.success('Transaction approved successfully')
    } catch (error) {
      toast.error('Failed to approve transaction')
    }
  }

  const handleRejectTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to reject this transaction?')) {
      try {
        setTransactions(transactions.map(transaction =>
          transaction.id === transactionId
            ? { ...transaction, status: 'rejected' }
            : transaction
        ))
        toast.success('Transaction rejected')
      } catch (error) {
        toast.error('Failed to reject transaction')
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
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600'
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="h-4 w-4" />
      case 'credit_card': return <CreditCard className="h-4 w-4" />
      case 'crypto': return <DollarSign className="h-4 w-4" />
      case 'paypal': return <DollarSign className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
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
        <title>Financial Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Financial Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor deposits, withdrawals, and financial transactions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Deposits
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownLeft className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Withdrawals
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Transactions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {transactions.filter(t => t.status === 'pending').length}
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
                    Failed Transactions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {transactions.filter(t => t.status === 'failed').length}
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="input-field"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Transaction
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Method
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">{transaction.reference}</div>
                              <div className="text-gray-500">{transaction.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {transaction.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'deposit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className={`font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                          {transaction.fee > 0 && (
                            <div className="text-xs text-gray-500">
                              Fee: {formatCurrency(transaction.fee)}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {getMethodIcon(transaction.method)}
                            <span className="ml-2 capitalize">{transaction.method.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewTransaction(transaction)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {transaction.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveTransaction(transaction.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectTransaction(transaction.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
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

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
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
                        Transaction Details - {selectedTransaction.reference}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User</label>
                            <p className="text-sm text-gray-900">{selectedTransaction.username}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedTransaction.type}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.amount)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Fee</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.fee)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Method</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedTransaction.method.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                              {selectedTransaction.status}
                            </span>
                          </div>
                        </div>

                        {selectedTransaction.bankDetails && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Bank Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Bank:</span> {selectedTransaction.bankDetails.bankName}
                              </div>
                              <div>
                                <span className="text-gray-500">Account:</span> {selectedTransaction.bankDetails.accountNumber}
                              </div>
                              <div>
                                <span className="text-gray-500">Routing:</span> {selectedTransaction.bankDetails.routingNumber}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedTransaction.cardDetails && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Card Details</h4>
                            <div className="text-sm">
                              <span className="text-gray-500">Type:</span> {selectedTransaction.cardDetails.cardType} ****{selectedTransaction.cardDetails.lastFour}
                            </div>
                          </div>
                        )}

                        {selectedTransaction.cryptoDetails && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Crypto Details</h4>
                            <div className="text-sm space-y-1">
                              <div><span className="text-gray-500">Network:</span> {selectedTransaction.cryptoDetails.network}</div>
                              <div><span className="text-gray-500">Currency:</span> {selectedTransaction.cryptoDetails.currency}</div>
                              <div><span className="text-gray-500">Address:</span> {selectedTransaction.cryptoDetails.address}</div>
                            </div>
                          </div>
                        )}

                        {selectedTransaction.errorMessage && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-red-900 mb-2">Error</h4>
                            <p className="text-sm text-red-700">{selectedTransaction.errorMessage}</p>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created:</span>
                            <span>{formatDate(selectedTransaction.createdAt)}</span>
                          </div>
                          {selectedTransaction.completedAt && (
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">Completed:</span>
                              <span>{formatDate(selectedTransaction.completedAt)}</span>
                            </div>
                          )}
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
                      setShowTransactionModal(false)
                      setSelectedTransaction(null)
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