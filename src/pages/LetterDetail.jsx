import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { lettersAPI } from '../lib/api/letters.js'

function LetterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [letter, setLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const calculateDaysUntilDelivery = (deliveryDate) => {
    if (!deliveryDate) return 0
    const delivery = new Date(deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    delivery.setHours(0, 0, 0, 0)
    const diffTime = delivery - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleEdit = () => {
    navigate(`/letters/${id}/edit`)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await lettersAPI.delete(id)
      
      if (response.success) {
        navigate('/dashboard')
      } else {
        setError(response.message || 'Failed to delete letter')
        setShowDeleteConfirm(false)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An error occurred while deleting the letter'
      setError(errorMessage)
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const daysUntilDelivery = letter ? calculateDaysUntilDelivery(letter.deliveryDate) : 0

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

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-xl">Status:</span>
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        letter.isDelivered
                          ? 'text-green-400 bg-green-500/20 border border-green-500/50'
                          : 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/50'
                      }`}
                    >
                      {letter.isDelivered ? '✓ Delivered' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                <p className="text-purple-200 mb-6">
                  Are you sure you want to delete this letter? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default LetterDetail

