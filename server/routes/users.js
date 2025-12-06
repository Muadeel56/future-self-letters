import express from 'express'
import { prisma } from '../lib/prisma.js'

const router = express.Router()

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

// POST /api/users - Create a test user (for testing - no auth yet)
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
    
    // TODO: Hash password before saving (we'll do this in auth milestone)
    const user = await prisma.user.create({
      data: {
        email,
        password, // For now, storing plain text (we'll hash it later)
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

