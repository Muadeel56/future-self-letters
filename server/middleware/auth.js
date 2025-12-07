import { verifyToken } from '../utils/auth.js'

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }
    
    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      })
    }
    
    // Verify token
    const decoded = verifyToken(token)
    
    // Attach user ID to request
    req.userId = decoded.userId
    
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    })
  }
}

