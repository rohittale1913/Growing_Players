import { useState } from 'react'
import Layout from '../layouts/MainLayout'
import { Heart, Users, Award, TrendingUp, Zap, Globe } from 'lucide-react'

export default function About() {
  const [activeTab, setActiveTab] = useState(0)

  const stats = [
    { icon: Users, number: '1K+', label: 'Happy Customers' },
    { icon: Award, number: '10+', label: 'Years Experience' },
    { icon: TrendingUp, number: '12+', label: 'Products' },
    { icon: Heart, number: '97%', label: 'Satisfaction Rate' },
  ]

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      experience: '15+ years in baking industry',
      bio: 'Visionary leader who started Growing Players with a dream to make premium baking supplies accessible to every baker in India.',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Product Development',
      experience: '12 years in food technology',
      bio: 'Expert in sourcing and curating the finest baking ingredients and decoration products from across India and internationally.',
    },
    {
      name: 'Arjun Patel',
      role: 'Operations Director',
      experience: '10 years in logistics & supply chain',
      bio: 'Ensures timely delivery and excellent customer service across India with our efficient distribution network.',
    },
    {
      name: 'Neha Gupta',
      role: 'Customer Success Manager',
      experience: '8 years in customer relations',
      bio: 'Dedicated to helping every customer find the perfect products and achieve their baking dreams.',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We only source premium, food-safe baking supplies that meet international standards.',
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Supporting home bakers, professionals, and businesses across India with comprehensive resources.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuously bringing new and trending products to keep your baking adventures fresh and exciting.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making premium baking supplies affordable and available to everyone, everywhere in India.',
    },
  ]

  const milestones = [
    { year: '2016', event: 'Growing Players founded with a vision.' },
    { year: '2019', event: 'Expanded product range to 12+ premium items.' },
    { year: '2021', event: 'Crossed 1,000+ active customers milestone.' },
    { year: '2023', event: 'Reached 5,000+ happy customers with 97% satisfaction rate.' },
    { year: '2026', event: 'Launched online platform to reach customers nationwide.' },
  
  ]

  return (
    <Layout>
      <div className="font-display min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Growing Players</h1>
            <p className="text-xl text-amber-100 mb-6">
              India's Premier Destination for Premium Cake Design Ingredients & Bakery Decoration. <br /> 
              10+ years of passion, quality, and innovation serving bakers and cake enthusiasts across India.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="card text-center hover:shadow-lg transition-shadow">
                    <Icon className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-amber-900 mb-1">{stat.number}</div>
                    <div className="text-gray-600 mb-3">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Growing Players was founded in 2016 with a simple yet powerful vision: to make premium baking supplies and cake decoration products accessible to every baker in India. What started as a small store in Delhi has blossomed into a trusted name across the country.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We realized early on that passionate bakers in India were struggling to find quality ingredients and tools. Import costs were high, local alternatives were limited, and the baking community needed support. That's when Growing Players was born.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Over 10 years, we've grown from a single store to a pan-India online presence, serving 1000+ happy customers. We've built relationships with premium suppliers worldwide while supporting local Indian manufacturers, ensuring you get the best of both worlds.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, Growing Players isn't just a store—it's a community. We're committed to growing with you, providing not just products but also knowledge, inspiration, and support for your baking journey.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">2016</div>
                  <p className="text-gray-700 font-semibold">Founded</p>
                </div>
                <div className="card bg-gradient-to-br from-rose-50 to-rose-100 p-6 text-center">
                  <div className="text-4xl font-bold text-rose-600 mb-2">10+</div>
                  <p className="text-gray-700 font-semibold">Years Strong</p>
                </div>
                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">Maharashtra</div>
                  <p className="text-gray-700 font-semibold">India Presence</p>
                </div>
                <div className="card bg-gradient-to-br from-orange-50 to-orange-100 p-6 text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">12+</div>
                  <p className="text-gray-700 font-semibold">Products</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 px-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Journey</h2>
            <div className="grid gap-6">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="  ">
                  <div className="flex  gap-8 justify-items-center items-center bg-gray-90 rounded-full px-8 py-2 shadow-md">
                    <div className="w-28 text-3xl font-bold text-orange-500 ">{milestone.year}</div>
                    <div className=" pt-1 ">
                      <p className="text-lg text-gray-800">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <div key={idx} className="card hover:shadow-lg transition-all hover:scale-105 p-3">
                    <Icon className="w-10 h-10 text-amber-600 mb-3" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, idx) => (
                <div key={idx} className="card bg-white hover:shadow-xl transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-amber-200 to-rose-200 rounded-lg mb-2 flex items-center justify-center">
                    <Users className="w-16 h-16 text-amber-600 opacity-50" />
                  </div>

                  <div className="p-4">

                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm mb-1">{member.role}</p>
                  <p className="text-gray-600 text-xs mb-3">{member.experience}</p>
                  <p className="text-gray-700 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-rose-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Growing Players?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: '✓ Quality Assured',
                  desc: 'Every product is carefully selected and quality-tested to ensure food safety and excellence.',
                },
                {
                  title: '✓ Best Prices',
                  desc: 'Premium ingredients at affordable prices without compromising on quality or value.',
                },
                {
                  title: '✓ Fast Delivery',
                  desc: 'Pan-Maharashtra delivery network ensuring your supplies reach you quickly and safely.',
                },
                {
                  title: '✓ Expert Support',
                  desc: 'Our experienced team is ready to help you choose the perfect products for your needs.',
                },
                {
                  title: '✓ Wide Selection',
                  desc: '12+ products ranging from basic supplies to premium international brands.',
                },
                {
                  title: '✓ Customer First',
                  desc: '97% satisfaction rate with easy returns, exchanges, and hassle-free customer service.',
                },
                {
                  title: '✓ Community Hub',
                  desc: 'Join thousands of bakers, learn new techniques, and share your creations with us.',
                },
                {
                  title: '✓ Innovation',
                  desc: 'Always bringing new and trending products to keep your baking adventures exciting.',
                },
              ].map((item, idx) => (
                <div key={idx} className="card bg-white p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card bg-gradient-to-br from-amber-50 to-amber-100 p-8 border-l-4 border-amber-600">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower every baker in India with access to premium, affordable, and diverse baking supplies and cake decoration products. We believe in making professional-quality ingredients accessible to hobbyists and professionals alike, fostering a thriving community of passionate bakers.
                </p>
              </div>
              <div className="card bg-gradient-to-br from-rose-50 to-rose-100 p-8 border-l-4 border-rose-600">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To become India's most trusted and beloved bakery supply partner, recognized for quality, innovation, and customer excellence. We envision a thriving baking community where every person can pursue their passion for cake design and baking with confidence and creativity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-rose-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-lg text-amber-100 mb-8">
              Become part of 5,000+ bakers who trust Growing Players for their baking needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="btn bg-white text-amber-500 px-8 py-3 rounded-lg font-semibold "
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="btn bg-white text-amber-500 px-8 py-3 rounded-lg font-semibold"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
