import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Code, Zap, Shield, Book } from 'lucide-react'

export default function ApiDocumentation() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/auth/login",
      description: "Authenticate user and get access token",
      parameters: [
        { name: "username", type: "string", required: true, description: "User username" },
        { name: "password", type: "string", required: true, description: "User password" }
      ]
    },
    {
      method: "GET",
      path: "/api/v1/trading/signals",
      description: "Get current AI trading signals",
      parameters: [
        { name: "symbol", type: "string", required: false, description: "Currency pair (e.g., EUR/USD)" },
        { name: "limit", type: "integer", required: false, description: "Number of signals to return" }
      ]
    },
    {
      method: "POST",
      path: "/api/v1/trading/paper-trade",
      description: "Execute a paper trade",
      parameters: [
        { name: "symbol", type: "string", required: true, description: "Currency pair" },
        { name: "amount", type: "number", required: true, description: "Trade amount" },
        { name: "direction", type: "string", required: true, description: "BUY or SELL" }
      ]
    }
  ]

  const features = [
    {
      icon: Code,
      title: "RESTful API",
      description: "Clean, intuitive REST API following industry standards"
    },
    {
      icon: Zap,
      title: "Real-time Data",
      description: "Access live market data and trading signals instantly"
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "JWT authentication and encrypted communications"
    },
    {
      icon: Book,
      title: "Comprehensive Docs",
      description: "Detailed documentation with code examples"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>API Documentation - dolesewonderlandfx</title>
        <meta name="description" content="Complete API documentation for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
            <p className="text-xl text-gray-600 mb-8">
              Integrate with our AI-powered trading platform
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 inline-block">
              <p className="text-blue-800">
                <strong>Base URL:</strong> https://api.dolesewonderlandfx.me
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg">
                <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Authentication */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Authentication</h2>
            <p className="text-gray-700 mb-6">
              All API requests require authentication using JWT tokens. Include the token in the Authorization header:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm mb-4">
              Authorization: Bearer your_jwt_token_here
            </div>
            <p className="text-gray-700">
              Get your JWT token by calling the login endpoint with your credentials.
            </p>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">API Endpoints</h2>

            {endpoints.map((endpoint, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="ml-4 text-lg font-mono text-gray-900">{endpoint.path}</code>
                </div>

                <p className="text-gray-700 mb-4">{endpoint.description}</p>

                {endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters:</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-semibold">Name</th>
                            <th className="text-left py-2 px-4 font-semibold">Type</th>
                            <th className="text-left py-2 px-4 font-semibold">Required</th>
                            <th className="text-left py-2 px-4 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, paramIndex) => (
                            <tr key={paramIndex} className="border-b border-gray-100">
                              <td className="py-2 px-4 font-mono text-blue-600">{param.name}</td>
                              <td className="py-2 px-4 text-gray-600">{param.type}</td>
                              <td className="py-2 px-4">
                                {param.required ? (
                                  <span className="text-red-600 font-semibold">Yes</span>
                                ) : (
                                  <span className="text-gray-600">No</span>
                                )}
                              </td>
                              <td className="py-2 px-4 text-gray-700">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Code Examples</h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript (Node.js)</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800">
{`const axios = require('axios');

// Login to get JWT token
const login = async () => {
  try {
    const response = await axios.post('https://api.dolesewonderlandfx.me/api/v1/auth/login', {
      username: 'your_username',
      password: 'your_password'
    });

    const token = response.data.access_token;

    // Use token for authenticated requests
    const signals = await axios.get('https://api.dolesewonderlandfx.me/api/v1/trading/signals', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });

    console.log(signals.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

login();`}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Python</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800">
{`import requests

# Login to get JWT token
login_url = 'https://api.dolesewonderlandfx.me/api/v1/auth/login'
login_data = {
    'username': 'your_username',
    'password': 'your_password'
}

response = requests.post(login_url, json=login_data)
token = response.json()['access_token']

# Use token for authenticated requests
headers = {'Authorization': f'Bearer {token}'}
signals_url = 'https://api.dolesewonderlandfx.me/api/v1/trading/signals'

signals_response = requests.get(signals_url, headers=headers)
print(signals_response.json())`}
                </pre>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Rate Limits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Authenticated Requests</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Per Minute:</strong> 60 requests</li>
                  <li><strong>Per Hour:</strong> 1,000 requests</li>
                  <li><strong>Per Day:</strong> 10,000 requests</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Unauthenticated Requests</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Per Minute:</strong> 10 requests</li>
                  <li><strong>Per Hour:</strong> 100 requests</li>
                  <li><strong>Per Day:</strong> 1,000 requests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}