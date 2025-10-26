import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '../components/DashboardHeader'
import TopNavbar from '../components/TopNavbar'
import MarketOverview from '../components/MarketOverview'
import AdvancedChart from '../components/AdvancedChart'
import AIInsights from '../components/AIInsights'
import Footer from '../components/Footer'
import { Menu, X, BarChart3, BookOpen, Target, TrendingUp, Users, Settings } from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' })
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'EUR/USD Alert', message: 'Price reached target level', time: '2 min ago' },
    { id: 2, title: 'Weekly Report', message: 'Your trading summary is ready', time: '1 hour ago' }
  ])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, current: true },
    { name: 'Portfolio', href: '/portfolio', icon: TrendingUp, current: false },
    { name: 'Backtesting', href: '/backtest', icon: Target, current: false },
    { name: 'Courses', href: '/courses', icon: BookOpen, current: false },
    { name: 'Community', href: '/community', icon: Users, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Advanced Trading Dashboard - dolesewonderlandfx</title>
        <meta name="description" content="Professional forex trading dashboard with AI insights, real-time charts, and advanced analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top Navbar */}
      <TopNavbar user={user} onMenuToggle={() => setSidebarOpen(true)} notifications={notifications} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
            <div className="flex flex-col w-full bg-white shadow-xl">
              <SidebarContent navigation={navigation} user={user} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-lg">
          <SidebarContent navigation={navigation} user={user} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <DashboardHeader user={user} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-primary-100">Ready to conquer the markets today?</p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold">$12,450.67</div>
                  <div className="text-primary-200">Portfolio Value</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Market Overview */}
          <MarketOverview />

          {/* Charts and Insights Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Advanced Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <AdvancedChart />
            </div>

            {/* AI Insights - Takes 1 column */}
            <div>
              <AIInsights />
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <Target className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">New Trade</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                <BarChart3 className="w-8 h-8 text-secondary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Backtest</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors">
                <BookOpen className="w-8 h-8 text-accent-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Learn</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Community</span>
              </button>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function SidebarContent({ navigation, user, onClose }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">dolesefx</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              item.current
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </a>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </>
  )
}