import express from 'express'
import { prisma } from '../lib/prisma.js'

const router = express.Router()

// GET /api/letters - Get all letters (for testing)
router.get('/', async (req, res) => {
  try {
    const letters = await prisma.letter.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    res.json({
      success: true,
      count: letters.length,
      data: letters
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching letters',
      error: error.message
    })
  }
})

// GET /api/letters/:id - Get a single letter
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const letter = await prisma.letter.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    if (!letter) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found'
      })
    }
    
    res.json({
      success: true,
      data: letter
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching letter',
      error: error.message
    })
  }
})

// POST /api/letters - Create a new letter (for testing - no auth yet)
router.post('/', async (req, res) => {
  try {
    const { userId, title, content, deliveryDate } = req.body
    
    // Basic validation
    if (!userId || !content || !deliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, content, deliveryDate'
      })
    }
    
    // Validate delivery date is in the future
    const delivery = new Date(deliveryDate)
    if (delivery <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Delivery date must be in the future'
      })
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    const letter = await prisma.letter.create({
      data: {
        userId,
        title: title || null,
        content,
        deliveryDate: delivery
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    res.status(201).json({
      success: true,
      message: 'Letter created successfully',
      data: letter
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating letter',
      error: error.message
    })
  }
})

export default router

