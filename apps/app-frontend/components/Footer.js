import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FX</span>
              </div>
              <span className="text-xl font-bold">dolesewonderlandfx</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering traders worldwide with AI-driven insights, comprehensive education,
              and cutting-edge trading tools to master the forex markets.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/dolesewonderlandfx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/dolesefx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/dolesewonderlandfx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@dolesewonderlandfx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Trading Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trading Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ai-trading" className="text-gray-400 hover:text-white transition-colors">AI Insights</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Advanced Charts</Link></li>
              <li><Link href="/backtest" className="text-gray-400 hover:text-white transition-colors">Backtesting Lab</Link></li>
              <li><Link href="/paper-trading" className="text-gray-400 hover:text-white transition-colors">Paper Trading</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Portfolio Tracker</Link></li>
            </ul>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Trading Courses</Link></li>
              <li><Link href="/ai-trading" className="text-gray-400 hover:text-white transition-colors">Market Analysis</Link></li>
              <li><Link href="/journal" className="text-gray-400 hover:text-white transition-colors">Strategy Guides</Link></li>
              <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Video Tutorials</Link></li>
              <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Webinars</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://support.dolesewonderlandfx.com" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="https://api.dolesewonderlandfx.com" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="mailto:support@dolesewonderlandfx.com" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="https://dolesewonderlandfx.com/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="https://dolesewonderlandfx.com/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm font-medium text-white">Email Support</p>
                <p className="text-sm text-gray-400">support@dolesewonderlandfx.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm font-medium text-white">Phone Support</p>
                <p className="text-sm text-gray-400">+255 742 346 456</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm font-medium text-white">Global Headquarters</p>
                <p className="text-sm text-gray-400">Tanga, Tanzania</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 dolesewonderlandfx. All rights reserved. Trading involves risk.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Market data delayed by 15 minutes</span>
              <span>•</span>
              <span>For educational purposes only</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer