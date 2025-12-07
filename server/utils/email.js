import { Resend } from 'resend'
import { render } from '@react-email/components'
import React from 'react'
import LetterEmail from '../emails/LetterEmail.js'

// Validate email configuration
function validateEmailConfig() {
  const missing = []
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    missing.push('RESEND_API_KEY')
  }
  if (!process.env.EMAIL_FROM || process.env.EMAIL_FROM === 'noreply@yourdomain.com') {
    missing.push('EMAIL_FROM')
  }
  if (!process.env.EMAIL_FROM_NAME) {
    missing.push('EMAIL_FROM_NAME')
  }
  return missing
}

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send a letter email to a user
 * @param {string} userEmail - Recipient email address
 * @param {string} userName - Recipient name
 * @param {object} letter - Letter object with title, content, createdAt, deliveryDate
 * @returns {Promise<object>} Email sending result
 */
export async function sendLetterEmail(userEmail, userName, letter) {
  try {
    // Validate configuration
    const missingConfig = validateEmailConfig()
    if (missingConfig.length > 0) {
      return {
        success: false,
        error: `Missing email configuration: ${missingConfig.join(', ')}. Please update your .env file.`,
        message: 'Email service not configured'
      }
    }

    // Render React email component to HTML
    const emailHtml = await render(
      React.createElement(LetterEmail, {
        userName: userName || 'there',
        letterTitle: letter.title,
        letterContent: letter.content,
        createdAt: letter.createdAt,
        deliveryDate: letter.deliveryDate,
      })
    )

    // Create plain text version for better deliverability
    const plainText = `You have a letter from your past self!

Hello ${userName || 'there'},

You wrote this letter to yourself on ${new Date(letter.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}.

It was scheduled for delivery on ${new Date(letter.deliveryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}.

${letter.title ? `\n${letter.title}\n` : ''}
${letter.content}

Thank you for using Future Self Letters!`

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      replyTo: process.env.EMAIL_FROM,
      subject: letter.title 
        ? `${letter.title} - Letter from your past self`
        : 'Letter from your past self',
      html: emailHtml,
      text: plainText,
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      messageId: data?.id,
      message: 'Email sent successfully'
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    }
  }
}

/**
 * Send a test email
 * @param {string} testEmail - Test email address
 * @returns {Promise<object>} Email sending result
 */
export async function sendTestEmail(testEmail) {
  const testLetter = {
    title: 'Test Letter',
    content: 'This is a test email to verify that the email service is working correctly. If you receive this, everything is set up properly!',
    createdAt: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
  }

  return await sendLetterEmail(testEmail, 'Test User', testLetter)
}

