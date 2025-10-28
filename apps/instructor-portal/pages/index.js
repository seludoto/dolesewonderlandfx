import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Courses',
    value: '12',
    icon: BookOpenIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    name: 'Active Students',
    value: '1,234',
    icon: UserGroupIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    name: 'Total Revenue',
    value: '$45,678',
    icon: CurrencyDollarIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    name: 'Completion Rate',
    value: '78%',
    icon: ArrowTrendingUpIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]

const recentCourses = [
  {
    id: 1,
    title: 'Advanced Forex Trading Strategies',
    students: 156,
    rating: 4.8,
    revenue: '$2,340',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Technical Analysis Masterclass',
    students: 89,
    rating: 4.9,
    revenue: '$1,780',
    status: 'Published'
  },
  {
    id: 3,
    title: 'Risk Management in Trading',
    students: 67,
    rating: 4.7,
    revenue: '$1,205',
    status: 'Draft'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'enrollment',
    message: 'New student enrolled in "Advanced Forex Trading Strategies"',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'completion',
    message: 'Student completed "Technical Analysis Masterclass"',
    time: '15 minutes ago'
  },
  {
    id: 3,
    type: 'review',
    message: 'New 5-star review for "Risk Management in Trading"',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment received: $49 for "Advanced Forex Trading Strategies"',
    time: '2 hours ago'
  }
]

export default function InstructorDashboard() {
  return (
    <InstructorLayout>
      <Head>
        <title>Dashboard - Instructor Portal</title>
        <meta name="description" content="Instructor dashboard for course management" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your courses today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Courses
              </h3>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {course.students} students
                        <span className="mx-2">•</span>
                        ⭐ {course.rating}
                        <span className="mx-2">•</span>
                        {course.revenue}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                  View all courses →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === 'enrollment' && <UserGroupIcon className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'completion' && <BookOpenIcon className="h-4 w-4 text-green-600" />}
                        {activity.type === 'review' && <ChartBarIcon className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'payment' && <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1">
                        <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpenIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Create Course</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserGroupIcon className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Students</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Analytics</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Revenue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}