'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music4, Shuffle, ListMusic, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left relative z-20"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Guidefy
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Transform music direction with intelligent setlists
              </p>
              <div className="space-x-4">
                <Button
                  onClick={() => router.push('/register')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  size="lg"
                  className='text-gray-900'
                >
                  Sign In
                </Button>
              </div>
            </motion.div>

            {/* Right side - Animated Interface Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative rounded-lg bg-gray-800 p-6 shadow-2xl">
                <div className="absolute top-2 left-4 flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mt-4 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: item * 0.2 }}
                      className="flex items-center justify-between rounded bg-gray-700 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Music4 className="h-5 w-5 text-blue-400" />
                        <span className="text-sm">Song {item}</span>
                      </div>
                      <Shuffle className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -right-4 -top-4 h-20 w-20 rounded-lg bg-blue-500/20 backdrop-blur-sm"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -left-4 bottom-4 h-16 w-16 rounded-lg bg-purple-500/20 backdrop-blur-sm"
              />
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stat.value}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400">
              Everything you need for efficient music direction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-gray-900"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-gray-400">
              Start transforming your music direction today
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden"
          >
            <div className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$1.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Full access to all features
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <ListMusic className="h-5 w-5 text-blue-500 mr-3" />
                    {feature.title}
                  </li>
                ))}
                <li className="flex items-center text-gray-300">
                  <ListMusic className="h-5 w-5 text-blue-500 mr-3" />
                  Planning Center Integration
                </li>
              </ul>
              <Button
                onClick={() => router.push('/register')}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planning Center Integration Section */}
      <section className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planning Center Integration
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sync your setlists directly with Planning Center. 
              Keep everything organized in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Using Guidefy Today
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Join other music directors and transform your workflow
            </p>
            <Button
              onClick={() => router.push('/register')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Create Free Account
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const stats = [
  { value: '500+', label: 'Songs Organized' },
  { value: '100+', label: 'Active Users' },
  { value: '1000+', label: 'Setlists Created' },
  { value: '4.9', label: 'Average Rating' },
];

const features = [
  {
    title: 'Quick Creation',
    description: 'Build your setlists in seconds with our intuitive interface',
    icon: '🎵'
  },
  {
    title: 'Easy Editing',
    description: 'Drag and drop to effortlessly reorganize your songs',
    icon: '✨'
  },
  {
    title: 'Total Organization',
    description: 'Keep all your setlists organized in one place',
    icon: '📋'
  }
];
