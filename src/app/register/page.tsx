'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, Mic2, Music2, Radio, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { register as registerUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { type RegisterFormData, registerSchema } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Form data before submission:', data);

      const result = await registerUser(data.name.trim(), data.email.trim().toLowerCase(), data.password);

      console.log('Registration result:', result);

      if (!result.success) {
        setError(result.error || 'Registration failed');
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred');
    }
  };

  const notes = Array(6).fill('♪');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.2))'
          }}
          animate={{
            y: [0, -30, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {notes.map((_, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-500/20 text-4xl font-bold"
          initial={{
            x: Math.random() * (windowSize.width || 0),
            y: Math.random() * (windowSize.height || 0)
          }}
          animate={{
            y: [0, -100, 0],
            x: index % 2 === 0 ? [0, 20, 0] : [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          ♪
        </motion.div>
      ))}

      <motion.div
        className="absolute top-20 right-32"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <Mic2 className="h-16 w-16 text-purple-500/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <Radio className="h-20 w-20 text-blue-500/20" />
      </motion.div>

      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex space-x-1">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-500/20 rounded-full"
              animate={{
                height: [20, 40, 20]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex space-x-1">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-purple-500/20 rounded-full"
              animate={{
                height: [20, 40, 20]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 1 }}
              className="inline-block p-3 rounded-full bg-blue-500/10 mb-4"
            >
              <Music2 className="h-8 w-8 text-blue-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Join Guidefy
            </motion.h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  {...register('name')}
                  type="text"
                  className="pl-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
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

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  {...register('password')}
                  type="password"
                  className="pl-10 w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Choose a password"
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-gray-400"
          >
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
