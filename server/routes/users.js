import express from 'express'
import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../utils/auth.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// GET /api/users/me - Get current authenticated user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            letters: true
          }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    })
  }
})

// GET /api/users - Get all users (for testing)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            letters: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    res.json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    })
  }
})

// POST /api/users - Create a new user (register)
router.post('/', async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password'
      })
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }
    
    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    })
  }
})

export default router

