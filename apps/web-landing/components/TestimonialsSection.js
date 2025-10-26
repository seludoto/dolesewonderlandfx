import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Professional Trader",
    avatar: "SJ",
    content: "dolesewonderlandfx transformed my trading career. The AI insights are incredibly accurate, and the courses are comprehensive. I've increased my win rate by 40% in just 3 months.",
    rating: 5,
    profit: "+$15,000"
  },
  {
    name: "Michael Chen",
    role: "Day Trader",
    avatar: "MC",
    content: "The paper trading simulator is amazing for practice. I was able to refine my strategies without risking real money. Now I'm consistently profitable.",
    rating: 5,
    profit: "+$8,500"
  },
  {
    name: "Emma Rodriguez",
    role: "Forex Beginner",
    avatar: "ER",
    content: "As a complete beginner, I was overwhelmed by forex. The structured courses and daily insights made learning enjoyable and effective. Highly recommend!",
    rating: 5,
    profit: "+$3,200"
  },
  {
    name: "David Thompson",
    role: "Swing Trader",
    avatar: "DT",
    content: "The backtesting lab is a game-changer. I can test strategies on historical data and optimize them before going live. My confidence has never been higher.",
    rating: 5,
    profit: "+$22,000"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Traders Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful traders who have transformed their forex journey with our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary-500 mb-4 opacity-50" />

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Avatar and Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{testimonial.profit}</div>
                  <div className="text-xs text-gray-500">Profit</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600">10,000+</div>
                <div className="text-gray-600">Active Traders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-600">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}