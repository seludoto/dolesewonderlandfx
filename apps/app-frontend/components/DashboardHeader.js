import { motion } from 'framer-motion'
import {
  Bell,
  Settings,
  User,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  Menu
} from 'lucide-react'
import { useState } from 'react'

export default function DashboardHeader({ user, onMenuToggle }) {
  const [notifications] = useState(3) // Mock notification count

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trading Dashboard</h1>
                <p className="text-xs text-gray-500">Real-time market insights</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search markets, symbols..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Market Status */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Markets Open</span>
              </div>
              <div className="text-sm text-gray-500">09:30 - 16:00 EST</div>
            </div>

            {/* Account Balance */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">$12,450.67</div>
                <div className="text-xs text-green-600">+2.4% today</div>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'John Doe'}</div>
                <div className="text-xs text-gray-500">Pro Trader</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}