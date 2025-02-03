'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterResponse {
  success: boolean
  error?: string
  user?: any
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    if (!name || !email || !password) {
      return {
        success: false,
        error: 'All fields are required'
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists'
      }
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error) {
      return { 
        success: false, 
        error: `Registration failed: ${error.message}` 
      }
    }

    return {
      success: false,
      error: 'Registration failed: Unknown error'
    }
  }
}
