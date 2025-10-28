import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/outline'

const courses = [
  {
    id: 1,
    title: 'Advanced Forex Trading Strategies',
    description: 'Master advanced trading strategies including Fibonacci retracements, Elliott Wave theory, and harmonic patterns.',
    students: 156,
    rating: 4.8,
    price: 149,
    status: 'Published',
    lastUpdated: '2025-01-15',
    modules: 12,
    duration: '8 hours'
  },
  {
    id: 2,
    title: 'Technical Analysis Masterclass',
    description: 'Complete guide to technical analysis including chart patterns, indicators, and market psychology.',
    students: 89,
    rating: 4.9,
    price: 99,
    status: 'Published',
    lastUpdated: '2025-01-10',
    modules: 8,
    duration: '6 hours'
  },
  {
    id: 3,
    title: 'Risk Management in Trading',
    description: 'Learn essential risk management techniques to protect your trading capital and maximize profits.',
    students: 67,
    rating: 4.7,
    price: 79,
    status: 'Draft',
    lastUpdated: '2025-01-20',
    modules: 6,
    duration: '4 hours'
  },
  {
    id: 4,
    title: 'Cryptocurrency Trading Fundamentals',
    description: 'Introduction to cryptocurrency trading, blockchain technology, and digital asset markets.',
    students: 0,
    rating: 0,
    price: 59,
    status: 'Draft',
    lastUpdated: '2025-01-25',
    modules: 4,
    duration: '3 hours'
  }
]

export default function CoursesPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Courses - Instructor Portal</title>
        <meta name="description" content="Manage your courses and content" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and create your trading courses
            </p>
          </div>
          <Link href="/courses/create">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.length}
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
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.reduce((sum, course) => sum + course.students, 0)}
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
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(courses.filter(c => c.rating > 0).reduce((sum, course) => sum + course.rating, 0) / courses.filter(c => c.rating > 0).length).toFixed(1)}
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
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {courses.filter(c => c.status === 'Published').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {course.students} students
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    {course.rating > 0 ? course.rating : 'No ratings'}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${course.price}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{course.modules} modules</span>
                  <span>Updated {course.lastUpdated}</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for New Instructors */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first course.
            </p>
            <div className="mt-6">
              <Link href="/courses/create">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Course
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  )
}