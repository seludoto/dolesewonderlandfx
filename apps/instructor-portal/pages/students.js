import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'
import {
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const students = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1 (555) 123-4567',
    coursesEnrolled: 3,
    coursesCompleted: 2,
    totalSpent: 327,
    lastActive: '2025-01-28',
    status: 'Active',
    joinDate: '2024-11-15'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1 (555) 234-5678',
    coursesEnrolled: 2,
    coursesCompleted: 1,
    totalSpent: 228,
    lastActive: '2025-01-27',
    status: 'Active',
    joinDate: '2024-12-01'
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol.w@email.com',
    phone: '+1 (555) 345-6789',
    coursesEnrolled: 1,
    coursesCompleted: 0,
    totalSpent: 149,
    lastActive: '2025-01-25',
    status: 'Inactive',
    joinDate: '2024-12-20'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 456-7890',
    coursesEnrolled: 4,
    coursesCompleted: 3,
    totalSpent: 476,
    lastActive: '2025-01-28',
    status: 'Active',
    joinDate: '2024-10-10'
  }
]

const stats = [
  {
    name: 'Total Students',
    value: students.length,
    icon: UserGroupIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    name: 'Active Students',
    value: students.filter(s => s.status === 'Active').length,
    icon: ArrowTrendingUpIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    name: 'Completion Rate',
    value: `${Math.round((students.reduce((sum, s) => sum + s.coursesCompleted, 0) / students.reduce((sum, s) => sum + s.coursesEnrolled, 0)) * 100)}%`,
    icon: CheckCircleIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    name: 'Total Revenue',
    value: `$${students.reduce((sum, s) => sum + s.totalSpent, 0)}`,
    icon: ArrowTrendingUpIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  }
]

export default function StudentsPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Students - Instructor Portal</title>
        <meta name="description" content="Manage and analyze student performance" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track student progress and engagement
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

        {/* Students Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student List
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detailed view of all enrolled students
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            {student.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.coursesCompleted}/{student.coursesEnrolled} courses
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(student.coursesCompleted / student.coursesEnrolled) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${student.totalSpent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {students.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Students will appear here once they enroll in your courses.
            </p>
          </div>
        )}
      </div>
    </InstructorLayout>
  )
}