import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Users, MessageSquare, TrendingUp, Award, Calendar, ExternalLink } from 'lucide-react'

export default function Community() {
  const communityFeatures = [
    {
      icon: Users,
      title: "Trader Community",
      description: "Connect with thousands of traders worldwide. Share strategies, discuss market trends, and learn from experienced traders.",
      stats: "10,000+ Members"
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Participate in topic-specific forums covering technical analysis, fundamental analysis, trading strategies, and more.",
      stats: "50+ Topics"
    },
    {
      icon: TrendingUp,
      title: "Strategy Sharing",
      description: "Share your winning strategies with the community. Get feedback, improve your approach, and discover new techniques.",
      stats: "1,000+ Strategies"
    },
    {
      icon: Award,
      title: "Leaderboards",
      description: "Compete with other traders on our performance leaderboards. Track your progress and celebrate achievements.",
      stats: "Monthly Rankings"
    }
  ]

  const upcomingEvents = [
    {
      title: "Weekly Market Analysis",
      date: "Every Wednesday",
      time: "8:00 PM EST",
      description: "Live analysis of major currency pairs and market outlook"
    },
    {
      title: "Beginner Trading Workshop",
      date: "October 30, 2025",
      time: "2:00 PM EST",
      description: "Learn forex basics from experienced traders"
    },
    {
      title: "Strategy Showcase",
      date: "November 5, 2025",
      time: "7:00 PM EST",
      description: "Community members present their best trading strategies"
    }
  ]

  const topContributors = [
    { name: "Sarah Chen", role: "Strategy Expert", posts: 245, badge: "Gold" },
    { name: "Mike Rodriguez", role: "Technical Analyst", posts: 198, badge: "Gold" },
    { name: "Emma Thompson", role: "Risk Manager", posts: 176, badge: "Silver" },
    { name: "David Kim", role: "Forex Veteran", posts: 152, badge: "Silver" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Community - dolesewonderlandfx</title>
        <meta name="description" content="Join the dolesewonderlandfx trading community - connect, learn, and grow with fellow traders" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Community</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with fellow traders, share knowledge, and grow together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://forum.dolesewonderlandfx.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                Visit Community Forum
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/dolesewonderlandfx"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                Join Discord
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Community Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <span className="text-sm text-primary-600 font-medium">{feature.stats}</span>
                  </div>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Upcoming Community Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-primary-600">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.time}</p>
                  <p className="text-gray-700 text-sm">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Top Community Contributors</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topContributors.map((contributor, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-gray-900">{contributor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{contributor.role}</p>
                  <div className="flex items-center justify-center mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      contributor.badge === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contributor.badge} Contributor
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{contributor.posts} posts</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Do&apos;s</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Share your trading experiences and strategies</li>
                  <li>• Ask questions and help others learn</li>
                  <li>• Provide constructive feedback</li>
                  <li>• Respect different trading styles and opinions</li>
                  <li>• Follow trading best practices and risk management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Don&apos;ts</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Share unverified trading advice as absolute truth</li>
                  <li>• Spam or post irrelevant content</li>
                  <li>• Engage in harassment or disrespectful behavior</li>
                  <li>• Share personal financial information</li>
                  <li>• Promote unrealistic expectations or &quot;get rich quick&quot; schemes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Join Community CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Join the Community?</h3>
            <p className="text-lg mb-6">
              Connect with traders worldwide, share your insights, and accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/dolesewonderlandfx"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join Discord Server
              </a>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Start a Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}