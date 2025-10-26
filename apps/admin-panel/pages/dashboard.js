import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive
} from 'lucide-react'

export default function Dashboard() {
  // Mock data - in a real app, this would come from API calls
  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Active Trading Sessions',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: Activity,
    },
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+23.1%',
      changeType: 'increase',
      icon: DollarSign,
    },
    {
      name: 'AI Predictions Today',
      value: '892',
      change: '+15.3%',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ]

  const services = [
    { name: 'API Gateway', status: 'healthy', port: 8000, icon: Server },
    { name: 'Auth Service', status: 'healthy', port: 8002, icon: Database },
    { name: 'AI Pipeline', status: 'healthy', port: 8003, icon: Cpu },
    { name: 'Paper Trading', status: 'healthy', port: 8005, icon: HardDrive },
  ]

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - DoleSe Wonderland FX</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Service Status */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Service Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.name} className="card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">Port: {service.port}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'healthy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New user registration
                  </p>
                  <p className="text-sm text-gray-500">
                    john.doe@example.com joined the platform
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  2 minutes ago
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    AI prediction generated
                  </p>
                  <p className="text-sm text-gray-500">
                    EUR/USD bullish signal with 78% confidence
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  5 minutes ago
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Trading session started
                  </p>
                  <p className="text-sm text-gray-500">
                    User started paper trading session
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  12 minutes ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}