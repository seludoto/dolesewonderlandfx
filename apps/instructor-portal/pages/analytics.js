import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'

const analyticsData = {
  overview: {
    totalRevenue: 45678,
    totalStudents: 1234,
    averageRating: 4.8,
    completionRate: 78
  },
  revenue: {
    monthly: [
      { month: 'Jan', amount: 3200 },
      { month: 'Feb', amount: 4100 },
      { month: 'Mar', amount: 3800 },
      { month: 'Apr', amount: 5200 },
      { month: 'May', amount: 4800 },
      { month: 'Jun', amount: 6100 },
      { month: 'Jul', amount: 5800 },
      { month: 'Aug', amount: 7200 },
      { month: 'Sep', amount: 6900 },
      { month: 'Oct', amount: 8100 },
      { month: 'Nov', amount: 7800 },
      { month: 'Dec', amount: 8900 }
    ]
  },
  enrollments: {
    monthly: [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 52 },
      { month: 'Mar', count: 48 },
      { month: 'Apr', count: 67 },
      { month: 'May', count: 59 },
      { month: 'Jun', count: 78 },
      { month: 'Jul', count: 71 },
      { month: 'Aug', count: 89 },
      { month: 'Sep', count: 83 },
      { month: 'Oct', count: 95 },
      { month: 'Nov', count: 91 },
      { month: 'Dec', count: 107 }
    ]
  }
}

const topCourses = [
  {
    title: 'Advanced Forex Trading Strategies',
    enrollments: 156,
    revenue: 23400,
    rating: 4.8,
    completionRate: 85
  },
  {
    title: 'Technical Analysis Masterclass',
    enrollments: 89,
    revenue: 17800,
    rating: 4.9,
    completionRate: 92
  },
  {
    title: 'Risk Management in Trading',
    enrollments: 67,
    revenue: 12050,
    rating: 4.7,
    completionRate: 78
  }
]

export default function AnalyticsPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Analytics - Instructor Portal</title>
        <meta name="description" content="Detailed analytics and insights for your courses" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your course performance and student engagement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">$</span>
                    </div>
                  </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${analyticsData.overview.totalRevenue.toLocaleString()}
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
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">👥</span>
                    </div>
                  </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {analyticsData.overview.totalStudents.toLocaleString()}
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
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-sm">⭐</span>
                    </div>
                  </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {analyticsData.overview.averageRating}/5.0
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
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">📈</span>
                    </div>
                  </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completion Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {analyticsData.overview.completionRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Monthly Revenue
              </h3>
              <div className="h-64 flex items-end space-x-2">
                {analyticsData.revenue.monthly.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(data.amount / 10000) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enrollment Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Monthly Enrollments
              </h3>
              <div className="h-64 flex items-end space-x-2">
                {analyticsData.enrollments.monthly.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(data.count / 120) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Performing Courses
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCourses.map((course, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.enrollments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${course.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          <span className="text-sm text-gray-900">{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.completionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-lg">⏱️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg. Course Duration
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      5.2 hours
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
                  <span className="text-lg">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Student Retention
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      82%
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
                  <span className="text-lg">📈</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Growth Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      +23%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Advanced Analytics */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-2">
              PRO
            </span>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Advanced Analytics</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Custom Indicators */}
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Custom Performance Indicators</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sortino Ratio</span>
                  <span className="text-sm font-medium text-gray-900">2.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Information Ratio</span>
                  <span className="text-sm font-medium text-gray-900">1.23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Omega Ratio</span>
                  <span className="text-sm font-medium text-gray-900">1.67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kelly Criterion</span>
                  <span className="text-sm font-medium text-gray-900">12.3%</span>
                </div>
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Predictive Insights</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-base mr-2">📈</span>
                    <span className="text-sm font-medium text-green-800">Strong Growth Predicted</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Next quarter revenue +28% likely</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-base mr-2">⚠️</span>
                    <span className="text-sm font-medium text-yellow-800">Retention Risk</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">3 courses showing declining engagement</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-base mr-2">📊</span>
                    <span className="text-sm font-medium text-blue-800">Market Opportunity</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Forex trading courses trending +45%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}