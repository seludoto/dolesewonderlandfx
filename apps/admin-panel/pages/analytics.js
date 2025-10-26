import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react'

export default function AnalyticsPage() {
  // Mock analytics data
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Trading Volume',
      value: '$1.2M',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'AI Predictions',
      value: '15,892',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const chartData = [
    { month: 'Jan', revenue: 12000, users: 1200 },
    { month: 'Feb', revenue: 15000, users: 1400 },
    { month: 'Mar', revenue: 18000, users: 1600 },
    { month: 'Apr', revenue: 22000, users: 1800 },
    { month: 'May', revenue: 25000, users: 2100 },
    { month: 'Jun', revenue: 28000, users: 2400 }
  ]

  return (
    <AdminLayout>
      <Head>
        <title>Analytics - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Platform performance and usage statistics
        </p>

        {/* Metrics Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.title} className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {metric.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${(data.revenue / 30000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(data.users / 2500) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Assets */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Assets</h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EUR/USD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Forex</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2.1M</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+2.34%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BTC/USD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Crypto</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1.8M</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+5.67%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AAPL</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Stocks</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$950K</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-1.23%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}