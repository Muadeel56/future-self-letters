import express from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// GET /api/letters/stats - Get delivery statistics (must be before /:id route)
router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.letter.groupBy({
      by: ['emailStatus', 'isDelivered'],
      where: {
        userId: req.userId
      },
      _count: true
    })
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    })
  }
})

// GET /api/letters - Get all letters for the authenticated user
router.get('/', async (req, res) => {
  try {
    const letters = await prisma.letter.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        content: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        deliveredAt: true,
        isDelivered: true,
        emailSentAt: true,
        emailStatus: true,
        emailRetryCount: true,
        lastEmailError: true
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

// GET /api/letters/:id - Get a single letter (only if it belongs to the user)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const letter = await prisma.letter.findFirst({
      where: {
        id,
        userId: req.userId // Ensure user owns this letter
      },
      select: {
        id: true,
        title: true,
        content: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        deliveredAt: true,
        isDelivered: true,
        emailSentAt: true,
        emailStatus: true,
        emailRetryCount: true,
        lastEmailError: true
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

// POST /api/letters - Create a new letter (for authenticated user)
router.post('/', async (req, res) => {
  try {
    const { title, content, deliveryDate } = req.body
    
    // Basic validation
    if (!content || !deliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: content, deliveryDate'
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
    
    // Create letter for authenticated user
    const letter = await prisma.letter.create({
      data: {
        userId: req.userId, // Use authenticated user's ID
        title: title || null,
        content,
        deliveryDate: delivery
      },
      select: {
        id: true,
        title: true,
        content: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        deliveredAt: true,
        isDelivered: true,
        emailSentAt: true,
        emailStatus: true,
        emailRetryCount: true,
        lastEmailError: true
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

// PUT /api/letters/:id - Update a letter (only if not delivered)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, deliveryDate } = req.body
    
    // Find letter and verify ownership
    const existingLetter = await prisma.letter.findFirst({
      where: {
        id,
        userId: req.userId
      }
    })
    
    if (!existingLetter) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found'
      })
    }
    
    // Check if letter is already delivered
    if (existingLetter.isDelivered) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a letter that has already been delivered'
      })
    }
    
    // Validate delivery date if provided
    if (deliveryDate) {
      const delivery = new Date(deliveryDate)
      if (delivery <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Delivery date must be in the future'
        })
      }
    }
    
    // Update letter
    const updatedLetter = await prisma.letter.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(deliveryDate !== undefined && { deliveryDate: new Date(deliveryDate) })
      },
      select: {
        id: true,
        title: true,
        content: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        deliveredAt: true,
        isDelivered: true,
        emailSentAt: true,
        emailStatus: true,
        emailRetryCount: true,
        lastEmailError: true
      }
    })
    
    res.json({
      success: true,
      message: 'Letter updated successfully',
      data: updatedLetter
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating letter',
      error: error.message
    })
  }
})

// DELETE /api/letters/:id - Delete a letter (only if not delivered)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Find letter and verify ownership
    const existingLetter = await prisma.letter.findFirst({
      where: {
        id,
        userId: req.userId
      }
    })
    
    if (!existingLetter) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found'
      })
    }
    
    // Check if letter is already delivered
    if (existingLetter.isDelivered) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a letter that has already been delivered'
      })
    }
    
    // Delete letter
    await prisma.letter.delete({
      where: { id }
    })
    
    res.json({
      success: true,
      message: 'Letter deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting letter',
      error: error.message
    })
  }
})

export default router
