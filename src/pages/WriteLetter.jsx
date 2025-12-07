import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { lettersAPI } from '../lib/api/letters.js'

function WriteLetter() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // Calculate tomorrow's date in YYYY-MM-DD format for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate content
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }

    // Validate delivery date
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required'
    } else {
      const selectedDate = new Date(deliveryDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate <= today) {
        newErrors.deliveryDate = 'Delivery date must be in the future'
      }
    }

    // Validate title (optional but has max length)
    if (title && title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Convert delivery date to ISO string
      const deliveryDateISO = new Date(deliveryDate).toISOString()
      
      const response = await lettersAPI.create(
        title.trim() || null,
        content.trim(),
        deliveryDateISO
      )

      if (response.success) {
        setSuccess(true)
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setErrors({ submit: response.message || 'Failed to create letter' })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An error occurred while creating your letter'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field, value) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }

    if (field === 'title') {
      setTitle(value)
    } else if (field === 'content') {
      setContent(value)
    } else if (field === 'deliveryDate') {
      setDeliveryDate(value)
      // Clear delivery date error if date is valid
      if (value) {
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate > today && errors.deliveryDate) {
          setErrors({ ...errors, deliveryDate: '' })
        }
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-purple-300 hover:text-purple-200 mb-4 flex items-center gap-2 transition"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Write to Your Future Self</h1>
            <p className="text-purple-200">Share your thoughts, dreams, and goals</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Letter created successfully! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {/* Title Field */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Give your letter a title (optional)"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title && (
                    <span className="text-red-300 text-xs">{errors.title}</span>
                  )}
                  <span className="text-purple-200 text-xs ml-auto">
                    {title.length}/100
                  </span>
                </div>
              </div>

              {/* Content Field */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
                  Letter Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  required
                  minLength={10}
                  rows={12}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  placeholder="Write your letter to your future self..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.content && (
                    <span className="text-red-300 text-xs">{errors.content}</span>
                  )}
                  <span className="text-purple-200 text-xs ml-auto">
                    {content.length} {content.length === 1 ? 'character' : 'characters'}
                    {content.length > 0 && content.length < 10 && (
                      <span className="text-yellow-400"> (minimum 10)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Delivery Date Field */}
              <div className="mb-6">
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-white mb-2">
                  Delivery Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
                  min={getTomorrowDate()}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.deliveryDate && (
                  <span className="text-red-300 text-xs mt-1 block">{errors.deliveryDate}</span>
                )}
                <p className="mt-1 text-xs text-purple-200">
                  Choose when you want to receive this letter
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Letter...' : success ? 'Letter Created!' : 'Create Letter'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  className="px-6 py-3 bg-white/5 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default WriteLetter

