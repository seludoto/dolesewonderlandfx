import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  BookOpen,
  Video,
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  Play,
  Download
} from 'lucide-react'

export default function ContentPage() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContent, setSelectedContent] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'article',
    category: 'beginner',
    description: '',
    content: '',
    tags: [],
    isPublished: false
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Mock content data
      const mockContent = [
        {
          id: 1,
          title: 'Introduction to Forex Trading',
          type: 'course',
          category: 'beginner',
          description: 'Learn the basics of forex trading from scratch',
          author: 'Expert Trader',
          status: 'published',
          views: 1250,
          likes: 89,
          createdAt: '2025-10-20T10:00:00Z',
          updatedAt: '2025-10-25T14:30:00Z',
          tags: ['forex', 'beginner', 'basics'],
          modules: [
            { title: 'What is Forex?', duration: '15 min', type: 'video' },
            { title: 'Currency Pairs', duration: '20 min', type: 'video' },
            { title: 'Trading Platforms', duration: '25 min', type: 'video' }
          ],
          thumbnail: '/api/placeholder/300/200'
        },
        {
          id: 2,
          title: 'Technical Analysis Fundamentals',
          type: 'article',
          category: 'intermediate',
          description: 'Master technical analysis tools and indicators',
          author: 'Technical Analyst',
          status: 'published',
          views: 890,
          likes: 67,
          createdAt: '2025-10-18T09:15:00Z',
          updatedAt: '2025-10-22T11:45:00Z',
          tags: ['technical', 'analysis', 'indicators'],
          content: 'Technical analysis is the study of past market data...',
          wordCount: 2500
        },
        {
          id: 3,
          title: 'Risk Management Strategies',
          type: 'video',
          category: 'advanced',
          description: 'Advanced risk management techniques for professional traders',
          author: 'Risk Manager',
          status: 'draft',
          views: 0,
          likes: 0,
          createdAt: '2025-10-26T16:20:00Z',
          updatedAt: '2025-10-26T16:20:00Z',
          tags: ['risk', 'management', 'advanced'],
          duration: '45 min',
          videoUrl: 'https://example.com/video/risk-management'
        },
        {
          id: 4,
          title: 'Cryptocurrency Trading Guide',
          type: 'course',
          category: 'intermediate',
          description: 'Complete guide to trading cryptocurrencies',
          author: 'Crypto Expert',
          status: 'published',
          views: 2100,
          likes: 145,
          createdAt: '2025-10-15T08:30:00Z',
          updatedAt: '2025-10-24T13:15:00Z',
          tags: ['crypto', 'bitcoin', 'trading'],
          modules: [
            { title: 'Crypto Basics', duration: '18 min', type: 'video' },
            { title: 'Exchange Selection', duration: '22 min', type: 'video' },
            { title: 'Trading Strategies', duration: '35 min', type: 'video' },
            { title: 'Security Best Practices', duration: '28 min', type: 'video' }
          ]
        },
        {
          id: 5,
          title: 'Market Psychology',
          type: 'article',
          category: 'advanced',
          description: 'Understanding trader psychology and emotional control',
          author: 'Psychology Expert',
          status: 'review',
          views: 0,
          likes: 0,
          createdAt: '2025-10-25T12:00:00Z',
          updatedAt: '2025-10-25T12:00:00Z',
          tags: ['psychology', 'emotions', 'mindset'],
          content: 'Market psychology plays a crucial role in trading success...',
          wordCount: 3200
        }
      ]
      setContent(mockContent)
    } catch (error) {
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewContent = (contentItem) => {
    setSelectedContent(contentItem)
    setShowContentModal(true)
  }

  const handleCreateContent = () => {
    setShowCreateModal(true)
  }

  const handleSaveContent = async () => {
    try {
      // In a real app, this would call the API
      const newContentItem = {
        ...newContent,
        id: content.length + 1,
        author: 'Admin',
        status: newContent.isPublished ? 'published' : 'draft',
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setContent([...content, newContentItem])
      setShowCreateModal(false)
      setNewContent({
        title: '',
        type: 'article',
        category: 'beginner',
        description: '',
        content: '',
        tags: [],
        isPublished: false
      })
      toast.success('Content created successfully')
    } catch (error) {
      toast.error('Failed to create content')
    }
  }

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        setContent(content.filter(item => item.id !== contentId))
        toast.success('Content deleted successfully')
      } catch (error) {
        toast.error('Failed to delete content')
      }
    }
  }

  const handlePublishContent = async (contentId) => {
    try {
      setContent(content.map(item =>
        item.id === contentId
          ? { ...item, status: 'published', updatedAt: new Date().toISOString() }
          : item
      ))
      toast.success('Content published successfully')
    } catch (error) {
      toast.error('Failed to publish content')
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
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course': return <BookOpen className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      case 'article': return <FileText className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
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
        <title>Content Management - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage courses, articles, and educational content
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleCreateContent}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Content
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {content.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Views
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Published Content
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {content.filter(item => item.status === 'published').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Draft Content
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {content.filter(item => item.status === 'draft').length}
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
                placeholder="Search content..."
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
              <option value="course">Courses</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
            </select>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((item) => (
            <div key={item.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getTypeIcon(item.type)}
                  <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{item.type}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.description}</p>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>By {item.author}</span>
                <span className="mx-2">•</span>
                <span>{item.category}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {item.views}
                  </span>
                  {item.likes > 0 && (
                    <span>{item.likes} likes</span>
                  )}
                </div>
                <span>{formatDate(item.updatedAt)}</span>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewContent(item)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handlePublishContent(item.id)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                    disabled={item.status === 'published'}
                  >
                    Publish
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteContent(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Content Detail Modal */}
        {showContentModal && selectedContent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedContent.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedContent.status)}`}>
                          {selectedContent.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <p className="text-sm text-gray-900 capitalize flex items-center">
                              {getTypeIcon(selectedContent.type)}
                              <span className="ml-2">{selectedContent.type}</span>
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <p className="text-sm text-gray-900 capitalize">{selectedContent.category}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <p className="text-sm text-gray-900">{selectedContent.author}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Views</label>
                            <p className="text-sm text-gray-900">{selectedContent.views.toLocaleString()}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <p className="text-sm text-gray-900 mt-1">{selectedContent.description}</p>
                        </div>

                        {selectedContent.modules && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Modules</label>
                            <div className="space-y-2">
                              {selectedContent.modules.map((module, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center">
                                    {module.type === 'video' ? <Play className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                    <span className="text-sm">{module.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{module.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedContent.content && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Content Preview</label>
                            <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-900 max-h-32 overflow-y-auto">
                              {selectedContent.content.substring(0, 300)}...
                            </div>
                          </div>
                        )}

                        {selectedContent.tags && selectedContent.tags.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {selectedContent.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created:</span>
                            <span>{formatDate(selectedContent.createdAt)}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-500">Updated:</span>
                            <span>{formatDate(selectedContent.updatedAt)}</span>
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
                      setShowContentModal(false)
                      setSelectedContent(null)
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Content Modal */}
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
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Create New Content
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            className="input-field mt-1"
                            value={newContent.title}
                            onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                            placeholder="Enter content title"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                              className="input-field mt-1"
                              value={newContent.type}
                              onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="course">Course</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                              className="input-field mt-1"
                              value={newContent.category}
                              onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            className="input-field mt-1"
                            rows={3}
                            value={newContent.description}
                            onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                            placeholder="Enter content description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                          <input
                            type="text"
                            className="input-field mt-1"
                            value={newContent.tags.join(', ')}
                            onChange={(e) => setNewContent({...newContent, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                            placeholder="Enter tags separated by commas"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            id="publish"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={newContent.isPublished}
                            onChange={(e) => setNewContent({...newContent, isPublished: e.target.checked})}
                          />
                          <label htmlFor="publish" className="ml-2 block text-sm text-gray-900">
                            Publish immediately
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn-primary mr-3"
                    onClick={handleSaveContent}
                  >
                    Create Content
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewContent({
                        title: '',
                        type: 'article',
                        category: 'beginner',
                        description: '',
                        content: '',
                        tags: [],
                        isPublished: false
                      })
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