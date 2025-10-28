import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'
import {
  VideoCameraIcon,
  DocumentTextIcon,
  PhotographIcon,
  UploadIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/outline'

const contentItems = [
  {
    id: 1,
    type: 'video',
    title: 'Introduction to Forex Trading',
    course: 'Advanced Forex Trading Strategies',
    duration: '15:30',
    size: '245 MB',
    status: 'Published',
    uploadDate: '2025-01-15'
  },
  {
    id: 2,
    type: 'quiz',
    title: 'Basic Concepts Quiz',
    course: 'Advanced Forex Trading Strategies',
    questions: 10,
    duration: '20 min',
    status: 'Published',
    uploadDate: '2025-01-16'
  },
  {
    id: 3,
    type: 'document',
    title: 'Trading Terminology Guide',
    course: 'Technical Analysis Masterclass',
    pages: 25,
    size: '2.1 MB',
    status: 'Published',
    uploadDate: '2025-01-18'
  },
  {
    id: 4,
    type: 'video',
    title: 'Chart Patterns Deep Dive',
    course: 'Technical Analysis Masterclass',
    duration: '28:45',
    size: '412 MB',
    status: 'Processing',
    uploadDate: '2025-01-25'
  }
]

const quickActions = [
  {
    name: 'Upload Video',
    description: 'Add video lectures to your courses',
    icon: VideoCameraIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    name: 'Create Quiz',
    description: 'Build interactive assessments',
    icon: DocumentTextIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    name: 'Add Resources',
    description: 'Upload documents and materials',
    icon: PhotographIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]

export default function ContentPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Content - Instructor Portal</title>
        <meta name="description" content="Manage course content, videos, and materials" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload and manage your course videos, quizzes, and resources
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <div key={action.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Library */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Content Library
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  All your course materials in one place
                </p>
              </div>
              <div className="flex space-x-3">
                <select className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <option>All Content</option>
                  <option>Videos</option>
                  <option>Quizzes</option>
                  <option>Documents</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload
                </button>
              </div>
            </div>
          </div>

          <ul className="divide-y divide-gray-200">
            {contentItems.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'video' ? 'bg-blue-100' :
                          item.type === 'quiz' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          {item.type === 'video' && <VideoCameraIcon className="h-5 w-5 text-blue-600" />}
                          {item.type === 'quiz' && <DocumentTextIcon className="h-5 w-5 text-green-600" />}
                          {item.type === 'document' && <PhotographIcon className="h-5 w-5 text-purple-600" />}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.course}</div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          {item.type === 'video' && (
                            <>
                              <PlayIcon className="h-3 w-3 mr-1" />
                              {item.duration} • {item.size}
                            </>
                          )}
                          {item.type === 'quiz' && (
                            <>
                              {item.questions} questions • {item.duration}
                            </>
                          )}
                          {item.type === 'document' && (
                            <>
                              {item.pages} pages • {item.size}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Published'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <PlayIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Zone */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload new content</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop files here, or click to browse
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Choose Files
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Supports: MP4, PDF, DOC, PPT up to 500MB each
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Video Lectures
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {contentItems.filter(item => item.type === 'video').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Quizzes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {contentItems.filter(item => item.type === 'quiz').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhotographIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Documents
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {contentItems.filter(item => item.type === 'document').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UploadIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Size
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      659 MB
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}