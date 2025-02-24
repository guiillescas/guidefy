'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Lock, Mail, Music, PlayCircle, Volume2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { type LoginFormData, loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred');
    }
  }

  const vinylCircles = Array(3).fill('');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
      </div>

      <div className="absolute left-20 top-1/2 -translate-y-1/2">
        {vinylCircles.map((_, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full border-2 border-blue-500/20 
              ${
                index === 0 ? 'h-32 w-32'
                : index === 1 ? 'h-24 w-24'
                : 'h-16 w-16'
              }`}
            style={{ left: index * 8, top: index * 8 }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: index * 0.2
              }
            }}
          />
        ))}
      </div>

      <div className="absolute right-20 top-1/2 -translate-y-1/2 flex space-x-1">
        {Array(8)
          .fill('')
          .map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-gradient-to-t from-blue-500/20 to-purple-500/20 rounded-full"
              animate={{
                height: [20 + Math.random() * 30, 40 + Math.random() * 40, 20 + Math.random() * 30]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
      </div>

      <motion.div
        className="absolute top-20 left-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <Headphones className="h-16 w-16 text-blue-500/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/4"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <Volume2 className="h-20 w-20 text-purple-500/20" />
      </motion.div>

      <motion.div
        className="absolute left-1/3 top-1/4 size-32 border-2 border-blue-500/10 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1.5 }}
              className="inline-block p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-4"
            >
              <PlayCircle className="h-8 w-8 text-blue-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  {...register('email')}
                  type="email"
                  className="pl-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  {...register('password')}
                  type="password"
                  className="pl-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-all h-[50px]"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-gray-400"
          >
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
