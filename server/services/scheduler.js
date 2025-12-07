import cron from 'node-cron'
import { prisma } from '../lib/prisma.js'
import { sendLetterEmail } from '../utils/email.js'

/**
 * Check for letters scheduled for delivery today and send them
 */
async function processScheduledLetters() {
  try {
    console.log('📧 Starting scheduled letter delivery check...')

    // Get today's date at midnight (start of day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get tomorrow's date at midnight (end of today)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Find letters scheduled for delivery today that haven't been delivered
    const lettersToDeliver = await prisma.letter.findMany({
      where: {
        deliveryDate: {
          gte: today,
          lt: tomorrow
        },
        isDelivered: false,
        emailStatus: {
          in: [null, 'pending', 'failed'] // Include failed ones for retry
        }
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

    console.log(`Found ${lettersToDeliver.length} letter(s) to deliver`)

    let successCount = 0
    let failureCount = 0

    // Process each letter
    for (const letter of lettersToDeliver) {
      try {
        console.log(`Processing letter ${letter.id} for user ${letter.user.email}`)

        // Send email
        const emailResult = await sendLetterEmail(
          letter.user.email,
          letter.user.name,
          {
            title: letter.title,
            content: letter.content,
            createdAt: letter.createdAt,
            deliveryDate: letter.deliveryDate
          }
        )

        if (emailResult.success) {
          // Update letter as delivered
          await prisma.letter.update({
            where: { id: letter.id },
            data: {
              isDelivered: true,
              deliveredAt: new Date(),
              emailSentAt: new Date(),
              emailStatus: 'sent',
              emailRetryCount: 0,
              lastEmailError: null
            }
          })

          console.log(`✅ Letter ${letter.id} delivered successfully`)
          successCount++
        } else {
          // Mark as failed
          await prisma.letter.update({
            where: { id: letter.id },
            data: {
              emailStatus: 'failed',
              emailRetryCount: {
                increment: 1
              },
              lastEmailError: emailResult.error || 'Unknown error'
            }
          })

          console.error(`❌ Failed to deliver letter ${letter.id}:`, emailResult.error)
          failureCount++
        }
      } catch (error) {
        console.error(`❌ Error processing letter ${letter.id}:`, error)

        // Mark as failed
        await prisma.letter.update({
          where: { id: letter.id },
          data: {
            emailStatus: 'failed',
            emailRetryCount: {
              increment: 1
            },
            lastEmailError: error.message
          }
        })

        failureCount++
      }
    }

    console.log(`📧 Delivery check complete: ${successCount} sent, ${failureCount} failed`)

    return {
      success: true,
      processed: lettersToDeliver.length,
      sent: successCount,
      failed: failureCount
    }
  } catch (error) {
    console.error('❌ Error in scheduled letter delivery:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Start the email delivery scheduler
 */
export function startEmailScheduler() {
  // Run every day at midnight (00:00)
  // Cron format: minute hour day month day-of-week
  // '0 0 * * *' = every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Scheduled task triggered at', new Date().toISOString())
    await processScheduledLetters()
  })

  // Also run every hour for testing (can be removed in production)
  // Uncomment this for more frequent checks during development
  // cron.schedule('0 * * * *', async () => {
  //   console.log('⏰ Hourly check triggered at', new Date().toISOString())
  //   await processScheduledLetters()
  // })

  console.log('✅ Email delivery scheduler started')
  console.log('📅 Schedule: Daily at midnight (00:00)')
}

/**
 * Manually trigger letter delivery (for testing)
 */
export async function triggerDeliveryNow() {
  console.log('🔔 Manually triggering letter delivery...')
  return await processScheduledLetters()
}

