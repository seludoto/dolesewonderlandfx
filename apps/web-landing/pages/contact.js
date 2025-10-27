import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '', category: 'general' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@dolesewonderlandfx.me",
      description: "Get help with technical issues and general inquiries"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Speak directly with our support team (Mon-Fri, 9AM-6PM EST)"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: "Available 24/7",
      description: "Instant support through our live chat system"
    },
    {
      icon: MapPin,
      title: "Business Address",
      details: "123 Trading Street, Financial District",
      description: "New York, NY 10001, United States"
    }
  ]

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. Urgent technical issues are prioritized and may receive faster responses."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes, phone support is available Monday through Friday, 9 AM to 6 PM Eastern Time. You can reach us at +1 (555) 123-4567."
    },
    {
      question: "Can I request new features?",
      answer: "Absolutely! We love hearing from our users. Please use the 'Feature Request' category in the contact form to suggest new features or improvements."
    },
    {
      question: "How do I report a bug?",
      answer: "Use the 'Technical Support' category in the contact form and provide as much detail as possible, including steps to reproduce the issue and your browser/system information."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Contact Us - dolesewonderlandfx</title>
        <meta name="description" content="Get in touch with dolesewonderlandfx support team for help and inquiries" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 mb-8">
              We&apos;re here to help! Get in touch with our support team
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <info.icon className="h-6 w-6 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-primary-600 font-medium">{info.details}</p>
                        <p className="text-gray-600 text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business Hours */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p className="text-primary-600 font-medium mt-2">24/7 Live Chat Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 md:last:border-b md:even:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}