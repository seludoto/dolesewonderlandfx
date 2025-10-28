import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Clock, Users, Star, Play, BookOpen, Award, TrendingUp } from 'lucide-react'

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const courses = [
    {
      id: 1,
      title: "Forex Trading Fundamentals",
      instructor: "Sarah Johnson",
      rating: 4.8,
      students: 2847,
      duration: "8 hours",
      level: "Beginner",
      price: 99,
      category: "fundamentals",
      image: "/course-1.jpg",
      description: "Master the basics of forex trading with comprehensive lessons on currency pairs, market hours, and basic analysis.",
      modules: 12,
      language: "English"
    },
    {
      id: 2,
      title: "Technical Analysis Mastery",
      instructor: "Mike Chen",
      rating: 4.9,
      students: 1923,
      duration: "15 hours",
      level: "Intermediate",
      price: 149,
      category: "technical",
      image: "/course-2.jpg",
      description: "Learn advanced technical analysis techniques including chart patterns, indicators, and price action strategies.",
      modules: 18,
      language: "English"
    },
    {
      id: 3,
      title: "AI-Powered Trading Strategies",
      instructor: "Dr. Emma Rodriguez",
      rating: 4.7,
      students: 1542,
      duration: "12 hours",
      level: "Advanced",
      price: 199,
      category: "ai",
      image: "/course-3.jpg",
      description: "Discover how to leverage AI insights and machine learning for better trading decisions and risk management.",
      modules: 16,
      language: "English"
    },
    {
      id: 4,
      title: "Risk Management & Psychology",
      instructor: "David Thompson",
      rating: 4.6,
      students: 1234,
      duration: "10 hours",
      level: "Intermediate",
      price: 129,
      category: "psychology",
      image: "/course-4.jpg",
      description: "Master the psychological aspects of trading and learn essential risk management techniques for long-term success.",
      modules: 14,
      language: "English"
    },
    {
      id: 5,
      title: "Cryptocurrency Trading",
      instructor: "Alex Kim",
      rating: 4.5,
      students: 987,
      duration: "9 hours",
      level: "Intermediate",
      price: 119,
      category: "crypto",
      image: "/course-5.jpg",
      description: "Explore the world of cryptocurrency trading with strategies for Bitcoin, Ethereum, and altcoins.",
      modules: 13,
      language: "English"
    },
    {
      id: 6,
      title: "Algorithmic Trading with Python",
      instructor: "Lisa Wang",
      rating: 4.8,
      students: 756,
      duration: "20 hours",
      level: "Advanced",
      price: 249,
      category: "programming",
      image: "/course-6.jpg",
      description: "Build automated trading systems using Python, pandas, and machine learning algorithms.",
      modules: 25,
      language: "English"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'fundamentals', name: 'Fundamentals', count: courses.filter(c => c.category === 'fundamentals').length },
    { id: 'technical', name: 'Technical Analysis', count: courses.filter(c => c.category === 'technical').length },
    { id: 'ai', name: 'AI Trading', count: courses.filter(c => c.category === 'ai').length },
    { id: 'psychology', name: 'Psychology', count: courses.filter(c => c.category === 'psychology').length },
    { id: 'crypto', name: 'Cryptocurrency', count: courses.filter(c => c.category === 'crypto').length },
    { id: 'programming', name: 'Programming', count: courses.filter(c => c.category === 'programming').length }
  ]

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory)

  const buyCourse = async (courseId) => {
    const course = courses.find(c => c.id === courseId)
    const res = await fetch(`${process.env.API_URL}/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course.price)
    })
    const data = await res.json()
    window.open(data.payment_url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Courses - dolesewonderlandfx</title>
        <meta name="description" content="Comprehensive forex trading courses with AI-powered insights and expert instruction" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Courses</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master forex trading with our comprehensive courses designed by industry experts and powered by AI insights.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{courses.length}</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {Math.round(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length * 10) / 10}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {courses.reduce((sum, course) => sum + parseInt(course.duration), 0)}
              </div>
              <div className="text-gray-600">Hours of Content</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Course Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{course.modules}</span> modules • <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">${course.price}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{course.instructor}</span>
                  </div>
                  <button
                    onClick={() => buyCourse(course.id)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white text-center">
          <Award className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Start Your Trading Journey Today</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of successful traders who have transformed their careers with our comprehensive courses and AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse All Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Free Trial Available
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}