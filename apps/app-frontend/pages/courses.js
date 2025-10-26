import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Courses() {
  const [courses, setCourses] = useState([])

  const buyCourse = async (courseId) => {
    const res = await fetch('http://localhost:8000/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(49.99)
    })
    const data = await res.json()
    window.open(data.payment_url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Courses - dolesewonderlandfx</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Courses</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
              <p className="mb-4">{course.description}</p>
              <p className="mb-4">Progress: {course.progress}%</p>
              {course.progress === 0 ? (
                <button onClick={() => buyCourse(course.id)} className="bg-green-600 text-white px-4 py-2 rounded">Buy Course ($49.99)</button>
              ) : (
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Continue Course</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}