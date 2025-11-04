import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'

export default function InstructorDashboard() {
  return (
    <InstructorLayout>
      <Head>
        <title>Instructor Portal</title>
        <meta name="description" content="Clean instructor dashboard for course management" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instructor Portal
          </h1>
          <p className="text-gray-600">
            Welcome to your instructor dashboard
          </p>
        </div>
      </div>
    </InstructorLayout>
  )
}
