import { motion } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, Users, Award } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-transparent"></div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-secondary-400 rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-accent-400 rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <TrendingUp className="w-4 h-4 mr-2 text-secondary-400" />
              <span className="text-sm font-medium">AI-Powered Trading Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Master Forex Trading with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-accent-400">
                {" "}AI Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-primary-100 mb-8 leading-relaxed"
            >
              Transform your trading journey with daily AI insights, structured courses,
              and hands-on practice. Join thousands of successful traders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button className="group bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">10K+</div>
                <div className="text-primary-200 text-sm">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400">95%</div>
                <div className="text-primary-200 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">$2M+</div>
                <div className="text-primary-200 text-sm">Profits Generated</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Mock Trading Dashboard */}
              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Live Market Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg mb-4 relative overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 left-0 h-full bg-gradient-to-t from-green-500 to-green-400 opacity-60"
                    initial={{ width: '30%' }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <div className="absolute top-4 left-4 text-white text-sm font-medium">EUR/USD</div>
                  <div className="absolute bottom-4 right-4 text-white text-lg font-bold">1.0842</div>
                </div>

                {/* Mock Trade Signals */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-green-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">BUY EUR/USD</span>
                    </div>
                    <span className="text-green-400 text-sm font-bold">+2.4%</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                      <span className="text-sm font-medium">SELL GBP/USD</span>
                    </div>
                    <span className="text-red-400 text-sm font-bold">-1.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}