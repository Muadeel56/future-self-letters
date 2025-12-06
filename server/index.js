import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors()) // Allow React app to make requests
app.use(express.json()) // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Future Self Letters API is running!' })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect()
    res.json({ 
      status: 'success',
      message: 'Database connected successfully!'
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

