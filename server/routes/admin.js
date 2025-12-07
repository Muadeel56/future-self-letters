import express from 'express'
import { sendTestEmail } from '../utils/email.js'

const router = express.Router()

// GET /api/admin/email-config - Check email configuration status
router.get('/email-config', (req, res) => {
  const config = {
    hasApiKey: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here'),
    hasFromEmail: !!(process.env.EMAIL_FROM && process.env.EMAIL_FROM !== 'noreply@yourdomain.com'),
    hasFromName: !!process.env.EMAIL_FROM_NAME,
    fromEmail: process.env.EMAIL_FROM || 'Not set',
    fromName: process.env.EMAIL_FROM_NAME || 'Not set',
    isConfigured: false
  }
  config.isConfigured = config.hasApiKey && config.hasFromEmail && config.hasFromName

  res.json({
    success: true,
    configured: config.isConfigured,
    config
  })
})

// POST /api/admin/test-email - Test email sending (development only)
router.post('/test-email', async (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Test endpoint not available in production'
    })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format'
      })
    }

    const result = await sendTestEmail(email)

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    })
  }
})

export default router

