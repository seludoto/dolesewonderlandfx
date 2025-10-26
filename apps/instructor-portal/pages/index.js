import Head from 'next/head'

export default function InstructorPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Instructor Portal - DoleSe Wonderland FX</title>
        <meta name="description" content="Course authoring and management portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Instructor Portal
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Course Management
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Create new courses</li>
                <li>• Edit existing content</li>
                <li>• Manage modules</li>
                <li>• Set pricing</li>
              </ul>
            </div>

            {/* Student Analytics */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                Student Analytics
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• Enrollment statistics</li>
                <li>• Completion rates</li>
                <li>• Student feedback</li>
                <li>• Revenue tracking</li>
              </ul>
            </div>

            {/* Content Tools */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
                Content Tools
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li>• Video upload</li>
                <li>• Quiz builder</li>
                <li>• Resource library</li>
                <li>• Preview tools</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Instructor portal features are under development.
              This will provide comprehensive tools for course authors and administrators.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}