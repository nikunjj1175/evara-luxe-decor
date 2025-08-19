'use client'

import { Heart, Award, Users, ShoppingBag, Star, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Home Decor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about helping you create beautiful, comfortable spaces that reflect your unique style and personality.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <Heart className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              To provide high-quality, beautiful home decoration items that transform houses into homes, 
              making every space feel welcoming and inspiring.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-blue-600 mb-3" />
            <div className="text-2xl font-bold text-gray-900">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-green-600 mb-3" />
            <div className="text-2xl font-bold text-gray-900">5,000+</div>
            <div className="text-gray-600">Products Sold</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-yellow-600 mb-3" />
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Star className="mx-auto h-8 w-8 text-purple-600 mb-3" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2008, Home Decor began as a small family business with a simple vision: 
                to help people create beautiful, comfortable homes that they love to live in.
              </p>
              <p>
                What started as a small shop has grown into a trusted destination for home decoration, 
                serving thousands of customers who share our passion for beautiful living spaces.
              </p>
              <p>
                Today, we continue to curate the finest selection of furniture, lighting, textiles, 
                and decorative items, always with quality, style, and customer satisfaction in mind.
              </p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">Our Store Image</span>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product in our collection is carefully selected 
                to meet our high standards for durability and craftsmanship.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We're committed to providing 
                exceptional service and support throughout your shopping journey.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of trends and continuously innovate our product offerings to bring 
                you the latest in home decoration and design.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">CEO Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-gray-600 mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-500">
                Passionate about creating beautiful spaces and helping customers find their perfect style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Designer Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-gray-600 mb-2">Lead Designer</p>
              <p className="text-sm text-gray-500">
                Expert in interior design with over 10 years of experience in creating stunning home environments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Manager Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-gray-600 mb-2">Customer Success Manager</p>
              <p className="text-sm text-gray-500">
                Dedicated to ensuring every customer has an exceptional shopping experience.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-6 opacity-90">
            Discover our collection of beautiful home decoration items and start creating your dream home today.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  )
}
