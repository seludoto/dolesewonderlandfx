import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  Reply,
  Archive,
  Star,
  Phone,
  Mail,
  MessageCircle,
  DollarSign,
  TrendingUp,
  BookOpen
} from 'lucide-react'

export default function SupportPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      // Mock support tickets data
      const mockTickets = [
        {
          id: 1,
          userId: 2,
          username: 'trader123',
          subject: 'Unable to withdraw funds',
          description: 'I\'m trying to withdraw $500 but the system shows an error saying insufficient balance, but I have $1500 in my account.',
          category: 'financial',
          priority: 'high',
          status: 'open',
          createdAt: '2025-10-27T14:00:00Z',
          updatedAt: '2025-10-27T14:00:00Z',
          assignedTo: 'support_agent_1',
          messages: [
            {
              id: 1,
              sender: 'trader123',
              senderType: 'user',
              message: 'I\'m trying to withdraw $500 but the system shows an error saying insufficient balance, but I have $1500 in my account.',
              timestamp: '2025-10-27T14:00:00Z'
            }
          ],
          tags: ['withdrawal', 'balance_issue']
        },
        {
          id: 2,
          userId: 3,
          username: 'crypto_trader',
          subject: 'Platform login issues',
          description: 'Cannot log into my account. Getting "Invalid credentials" error even though I\'m using the correct password.',
          category: 'technical',
          priority: 'urgent',
          status: 'in_progress',
          createdAt: '2025-10-27T13:30:00Z',
          updatedAt: '2025-10-27T14:15:00Z',
          assignedTo: 'tech_support',
          messages: [
            {
              id: 2,
              sender: 'crypto_trader',
              senderType: 'user',
              message: 'Cannot log into my account. Getting "Invalid credentials" error even though I\'m using the correct password.',
              timestamp: '2025-10-27T13:30:00Z'
            },
            {
              id: 3,
              sender: 'tech_support',
              senderType: 'agent',
              message: 'I\'ve checked your account and there seems to be a temporary authentication issue. We\'re working on resolving this. Please try again in 10 minutes.',
              timestamp: '2025-10-27T14:15:00Z'
            }
          ],
          tags: ['login', 'authentication']
        },
        {
          id: 3,
          userId: 4,
          username: 'forex_master',
          subject: 'Request for higher leverage',
          description: 'I\'ve been trading successfully for 6 months. Can I get access to 500x leverage instead of the current 100x limit?',
          category: 'account',
          priority: 'medium',
          status: 'open',
          createdAt: '2025-10-27T12:45:00Z',
          updatedAt: '2025-10-27T12:45:00Z',
          assignedTo: null,
          messages: [
            {
              id: 4,
              sender: 'forex_master',
              senderType: 'user',
              message: 'I\'ve been trading successfully for 6 months. Can I get access to 500x leverage instead of the current 100x limit?',
              timestamp: '2025-10-27T12:45:00Z'
            }
          ],
          tags: ['leverage', 'account_upgrade']
        },
        {
          id: 4,
          userId: 5,
          username: 'new_trader',
          subject: 'How to place a trade?',
          description: 'I\'m new to trading and don\'t know how to place my first trade. Can someone guide me through the process?',
          category: 'education',
          priority: 'low',
          status: 'resolved',
          createdAt: '2025-10-26T16:20:00Z',
          updatedAt: '2025-10-26T17:30:00Z',
          assignedTo: 'support_agent_2',
          resolvedAt: '2025-10-26T17:30:00Z',
          messages: [
            {
              id: 5,
              sender: 'new_trader',
              senderType: 'user',
              message: 'I\'m new to trading and don\'t know how to place my first trade. Can someone guide me through the process?',
              timestamp: '2025-10-26T16:20:00Z'
            },
            {
              id: 6,
              sender: 'support_agent_2',
              senderType: 'agent',
              message: 'Welcome to DoleSe Wonderland FX! I\'d be happy to help you get started. Here\'s a step-by-step guide to placing your first trade...',
              timestamp: '2025-10-26T16:45:00Z'
            },
            {
              id: 7,
              sender: 'new_trader',
              senderType: 'user',
              message: 'Thank you! That was very helpful. I successfully placed my first trade.',
              timestamp: '2025-10-26T17:25:00Z'
            }
          ],
          tags: ['beginner', 'tutorial']
        },
        {
          id: 5,
          userId: 2,
          username: 'trader123',
          subject: 'Margin call explanation',
          description: 'I received a margin call notification. Can you explain what this means and what I should do?',
          category: 'trading',
          priority: 'high',
          status: 'open',
          createdAt: '2025-10-27T11:15:00Z',
          updatedAt: '2025-10-27T11:15:00Z',
          assignedTo: 'risk_team',
          messages: [
            {
              id: 8,
              sender: 'trader123',
              senderType: 'user',
              message: 'I received a margin call notification. Can you explain what this means and what I should do?',
              timestamp: '2025-10-27T11:15:00Z'
            }
          ],
          tags: ['margin_call', 'risk_management']
        }
      ]
      setTickets(mockTickets)
    } catch (error) {
      toast.error('Failed to fetch support tickets')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setShowTicketModal(true)
  }

  const handleReplyToTicket = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    try {
      const newMessage = {
        id: selectedTicket.messages.length + 1,
        sender: 'admin',
        senderType: 'agent',
        message: replyMessage,
        timestamp: new Date().toISOString()
      }

      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [...ticket.messages, newMessage],
              updatedAt: new Date().toISOString(),
              status: ticket.status === 'open' ? 'in_progress' : ticket.status
            }
          : ticket
      ))

      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        updatedAt: new Date().toISOString(),
        status: selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status
      })

      setReplyMessage('')
      toast.success('Reply sent successfully')
    } catch (error) {
      toast.error('Failed to send reply')
    }
  }

  const handleCloseTicket = async (ticketId) => {
    try {
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'resolved', resolvedAt: new Date().toISOString() }
          : ticket
      ))
      toast.success('Ticket resolved successfully')
    } catch (error) {
      toast.error('Failed to resolve ticket')
    }
  }

  const handleAssignTicket = async (ticketId, agent) => {
    try {
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, assignedTo: agent, updatedAt: new Date().toISOString() }
          : ticket
      ))
      toast.success('Ticket assigned successfully')
    } catch (error) {
      toast.error('Failed to assign ticket')
    }
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
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'financial': return <DollarSign className="h-4 w-4" />
      case 'technical': return <AlertCircle className="h-4 w-4" />
      case 'trading': return <TrendingUp className="h-4 w-4" />
      case 'account': return <User className="h-4 w-4" />
      case 'education': return <BookOpen className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
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
        <title>Support Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Support Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage customer support tickets and provide assistance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Open Tickets
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tickets.filter(t => t.status === 'open').length}
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
                    In Progress
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tickets.filter(t => t.status === 'in_progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved Today
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tickets.filter(t => t.status === 'resolved' && new Date(t.resolvedAt).toDateString() === new Date().toDateString()).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    2.3h
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
                placeholder="Search tickets..."
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
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="input-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Ticket
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Priority
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Assigned To
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
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-1">{ticket.subject}</div>
                              <div className="text-gray-500 text-xs line-clamp-2">{ticket.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {getCategoryIcon(ticket.category)}
                            <span className="ml-2 capitalize">{ticket.category}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ticket.assignedTo ? ticket.assignedTo.replace('_', ' ') : 'Unassigned'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewTicket(ticket)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                              <button
                                onClick={() => handleCloseTicket(ticket.id)}
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
          </div>
        </div>

        {/* Ticket Detail Modal */}
        {showTicketModal && selectedTicket && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedTicket.subject}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                            {selectedTicket.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                            {selectedTicket.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">User</label>
                            <p className="text-sm text-gray-900">{selectedTicket.username}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <p className="text-sm text-gray-900 capitalize flex items-center">
                              {getCategoryIcon(selectedTicket.category)}
                              <span className="ml-2">{selectedTicket.category}</span>
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                            <p className="text-sm text-gray-900">
                              {selectedTicket.assignedTo ? selectedTicket.assignedTo.replace('_', ' ') : 'Unassigned'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Created</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                          </div>
                        </div>

                        {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {selectedTicket.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Messages */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Conversation</h4>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedTicket.messages.map((message) => (
                              <div key={message.id} className={`flex ${message.senderType === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.senderType === 'user'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-primary-600 text-white'
                                }`}>
                                  <div className="text-xs font-medium mb-1">
                                    {message.senderType === 'user' ? selectedTicket.username : 'Support Agent'}
                                  </div>
                                  <div className="text-sm">{message.message}</div>
                                  <div className="text-xs mt-1 opacity-70">
                                    {formatDate(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reply Section */}
                        {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Reply to Customer</h4>
                            <textarea
                              className="input-field w-full"
                              rows={4}
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your reply here..."
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={handleReplyToTicket}
                                className="btn-primary flex items-center"
                              >
                                <Reply className="h-4 w-4 mr-2" />
                                Send Reply
                              </button>
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
                      setShowTicketModal(false)
                      setSelectedTicket(null)
                      setReplyMessage('')
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