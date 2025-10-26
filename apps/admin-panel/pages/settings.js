import { useState } from 'react'
import Head from 'next/head'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import {
  Settings,
  Save,
  Database,
  Shield,
  Mail,
  Globe,
  Key
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'DoleSe Wonderland FX',
    siteDescription: 'Advanced AI-powered trading platform',
    adminEmail: 'admin@dolesewonderlandfx.com',
    enableRegistration: true,
    enableAI: true,
    enablePaperTrading: true,
    maintenanceMode: false,
    apiRateLimit: 1000,
    jwtExpiry: 30,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    databaseUrl: 'sqlite:///data/app.db',
    redisUrl: 'redis://localhost:6379'
  })

  const [activeTab, setActiveTab] = useState('general')

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success('Settings saved successfully!')
  }

  const handleInputChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    })
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'system', name: 'System', icon: Database }
  ]

  return (
    <AdminLayout>
      <Head>
        <title>Settings - Admin Panel</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure platform settings and preferences
        </p>

        <div className="mt-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="input-field"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 inline mr-2" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Site Name</label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                  <input
                    type="email"
                    className="input-field mt-1"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Site Description</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="enableRegistration"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={settings.enableRegistration}
                    onChange={(e) => handleInputChange('enableRegistration', e.target.checked)}
                  />
                  <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-900">
                    Enable user registration
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="enableAI"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={settings.enableAI}
                    onChange={(e) => handleInputChange('enableAI', e.target.checked)}
                  />
                  <label htmlFor="enableAI" className="ml-2 block text-sm text-gray-900">
                    Enable AI features
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="enablePaperTrading"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={settings.enablePaperTrading}
                    onChange={(e) => handleInputChange('enablePaperTrading', e.target.checked)}
                  />
                  <label htmlFor="enablePaperTrading" className="ml-2 block text-sm text-gray-900">
                    Enable paper trading
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="maintenanceMode"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                    Maintenance mode
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Rate Limit (requests/minute)</label>
                  <input
                    type="number"
                    className="input-field mt-1"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">JWT Expiry (minutes)</label>
                  <input
                    type="number"
                    className="input-field mt-1"
                    value={settings.jwtExpiry}
                    onChange={(e) => handleInputChange('jwtExpiry', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Configuration</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                  <input
                    type="number"
                    className="input-field mt-1"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SMTP Username</label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={settings.smtpUser}
                    onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
                  <input
                    type="password"
                    className="input-field mt-1"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Database URL</label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={settings.databaseUrl}
                    onChange={(e) => handleInputChange('databaseUrl', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Redis URL</label>
                  <input
                    type="text"
                    className="input-field mt-1"
                    value={settings.redisUrl}
                    onChange={(e) => handleInputChange('redisUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}