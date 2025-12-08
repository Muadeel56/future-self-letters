import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { lettersAPI } from '../lib/api/letters.js'
import { getDeliveryStatus, formatDeliveryDate, getDaysUntilDelivery } from '../lib/utils/deliveryStatus.js'

function LetterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [letter, setLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState(location.state?.message || null)

  useEffect(() => {
    fetchLetter()
  }, [id])

  const fetchLetter = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await lettersAPI.getById(id)
      
      if (response.success) {
        setLetter(response.data)
      } else {
        setError(response.message || 'Failed to load letter')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An error occurred while fetching the letter'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleEdit = () => {
    navigate(`/letters/${id}/edit`)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError(null)
      const response = await lettersAPI.delete(id)
      
      if (response.success) {
        // Navigate to dashboard with success message
        navigate('/dashboard', { 
          state: { message: 'Letter deleted successfully' } 
        })
      } else {
        // Handle API error response
        const errorMsg = response.message || 'Failed to delete letter'
        setError(errorMsg)
        setShowDeleteConfirm(false)
      }
    } catch (error) {
      // Enhanced error handling
      let errorMessage = 'An error occurred while deleting the letter'
      
      if (error.response) {
        const status = error.response.status
        const apiMessage = error.response?.data?.message
        
        if (status === 404) {
          errorMessage = 'Letter not found. It may have already been deleted.'
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to delete this letter."
        } else if (status === 400 && apiMessage) {
          // Check if it's about delivered letters
          if (apiMessage.toLowerCase().includes('delivered')) {
            errorMessage = 'This letter has already been delivered and cannot be deleted.'
          } else {
            errorMessage = apiMessage
          }
        } else if (apiMessage) {
          errorMessage = apiMessage
        }
      } else if (error.message) {
        // Network error or other error
        if (error.message.includes('Network') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setError(null)
  }

  const daysUntilDelivery = letter ? getDaysUntilDelivery(letter.deliveryDate) : 0
  const status = letter ? getDeliveryStatus(letter) : null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-purple-300 hover:text-purple-200 mb-4 flex items-center gap-2 transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Message from navigation state */}
          {message && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{message}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-yellow-300 hover:text-yellow-100"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center text-white py-12">
              <div className="text-2xl mb-2">Loading letter...</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-200 mb-2">Error</h2>
                <p className="text-red-300 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Letter Content */}
          {letter && !loading && !error && (
            <div className="max-w-3xl mx-auto">
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6 justify-end">
                {!letter.isDelivered && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-200 rounded-lg hover:bg-blue-500/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Letter Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-6">
                  {letter.title || 'Untitled Letter'}
                </h1>

                {/* Letter Content */}
                <div className="mb-8">
                  <div className="text-white whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {letter.content}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-8"></div>

                {/* Letter Metadata */}
                <div className="space-y-4">
                  {/* Creation Date */}
                  <div className="flex items-center gap-3 text-purple-200">
                    <span className="text-xl">📅</span>
                    <span>Created on {formatDate(letter.createdAt)}</span>
                  </div>

                  {/* Delivery Date */}
                  <div className="flex items-center gap-3 text-purple-200">
                    <span className="text-xl">📬</span>
                    <span>
                      {letter.isDelivered 
                        ? `Delivered on ${formatDate(letter.deliveredAt)}`
                        : `Will be delivered on ${formatDate(letter.deliveryDate)}`
                      }
                    </span>
                  </div>

                  {/* Countdown (if pending) */}
                  {!letter.isDelivered && daysUntilDelivery > 0 && (
                    <div className="flex items-center gap-3 text-yellow-300">
                      <span className="text-xl">⏰</span>
                      <span>
                        {daysUntilDelivery === 1 
                          ? '1 day until delivery'
                          : `${daysUntilDelivery} days until delivery`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Delivery Status Section */}
                <div className="mt-6 space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Delivery Status</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          status.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          status.color === 'red' ? 'bg-red-500/20 text-red-400' :
                          status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {status.icon} {status.text}
                        </span>
                      </div>
                      
                      {letter.deliveryDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Scheduled for:</span>
                          <span className="text-white">{formatDeliveryDate(letter.deliveryDate)}</span>
                        </div>
                      )}
                      
                      {letter.emailSentAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Sent on:</span>
                          <span className="text-white">{formatDeliveryDate(letter.emailSentAt)}</span>
                        </div>
                      )}
                      
                      {!letter.isDelivered && letter.deliveryDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Days until delivery:</span>
                          <span className="text-white">
                            {getDaysUntilDelivery(letter.deliveryDate)} day(s)
                          </span>
                        </div>
                      )}
                      
                      {letter.emailRetryCount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Retry attempts:</span>
                          <span className="text-white">{letter.emailRetryCount}</span>
                        </div>
                      )}
                      
                      {letter.lastEmailError && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-xs text-red-300 font-semibold mb-1">Last Error:</p>
                          <p className="text-xs text-red-200">{letter.lastEmailError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            title="Delete Letter"
            message="Are you sure you want to delete this letter? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
            isLoading={deleting}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default LetterDetail

