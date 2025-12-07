import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { lettersAPI } from '../lib/api/letters.js'
import ProtectedRoute from '../components/ProtectedRoute'
import ConfirmationDialog from '../components/ConfirmationDialog'

// Skeleton Loader Component
function LetterCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
      <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-4 bg-white/10 rounded w-4/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-white/10 rounded w-32"></div>
        <div className="h-6 bg-white/10 rounded w-24"></div>
      </div>
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [letterToDelete, setLetterToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null)

  useEffect(() => {
    fetchLetters()
  }, [])

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchLetters = async () => {
    try {
      setLoading(true)
      const response = await lettersAPI.getAll()
      if (response.success) {
        setLetters(response.data)
      }
    } catch (error) {
      console.error('Error fetching letters:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: letters.length,
      pending: letters.filter(l => !l.isDelivered).length,
      delivered: letters.filter(l => l.isDelivered).length
    }
  }, [letters])

  // Filter letters
  const filteredLetters = useMemo(() => {
    return letters.filter(letter => {
      if (filter === 'all') return true
      if (filter === 'pending') return !letter.isDelivered
      if (filter === 'delivered') return letter.isDelivered
      return true
    })
  }, [letters, filter])

  // Sort letters
  const sortedLetters = useMemo(() => {
    return [...filteredLetters].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      if (sortBy === 'delivery') {
        return new Date(a.deliveryDate) - new Date(b.deliveryDate)
      }
      return 0
    })
  }, [filteredLetters, sortBy])

  // Search letters
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return sortedLetters
    const query = searchQuery.toLowerCase()
    return sortedLetters.filter(letter => {
      const titleMatch = (letter.title || '').toLowerCase().includes(query)
      const contentMatch = letter.content.toLowerCase().includes(query)
      return titleMatch || contentMatch
    })
  }, [sortedLetters, searchQuery])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCardClick = (letterId) => {
    navigate(`/letters/${letterId}`)
  }

  const handleView = (e, letterId) => {
    e.stopPropagation()
    navigate(`/letters/${letterId}`)
  }

  const handleEdit = (e, letterId) => {
    e.stopPropagation()
    navigate(`/letters/${letterId}/edit`)
  }

  const handleDeleteClick = (e, letter) => {
    e.stopPropagation()
    setLetterToDelete(letter)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!letterToDelete) return
    
    setDeleting(true)
    try {
      const response = await lettersAPI.delete(letterToDelete.id)
      if (response.success) {
        await fetchLetters()
        setShowDeleteConfirm(false)
        setLetterToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting letter:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setLetterToDelete(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDaysUntilDelivery = (deliveryDate) => {
    const delivery = new Date(deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    delivery.setHours(0, 0, 0, 0)
    const diffTime = delivery - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get empty state message based on filter
  const getEmptyStateMessage = () => {
    if (searchQuery.trim()) {
      return {
        title: 'No results found',
        message: 'Try adjusting your search or filter',
        showCTA: false
      }
    }
    if (filter === 'all') {
      return {
        title: 'No letters yet',
        message: 'Start writing to your future self!',
        showCTA: true
      }
    }
    if (filter === 'pending') {
      return {
        title: 'No pending letters',
        message: 'All your letters have been delivered!',
        showCTA: false
      }
    }
    if (filter === 'delivered') {
      return {
        title: 'No delivered letters',
        message: 'Your letters are still pending delivery',
        showCTA: false
      }
    }
    return {
      title: 'No letters found',
      message: 'Try adjusting your filters',
      showCTA: false
    }
  }

  const emptyState = getEmptyStateMessage()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-300 hover:text-green-100 transition"
              >
                ×
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || user?.email}!
              </h1>
              <p className="text-purple-200">Manage your future self letters</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>

          {/* Statistics */}
          {!loading && letters.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">Total:</span>
                  <span className="text-white font-semibold">{stats.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">Pending:</span>
                  <span className="text-yellow-400 font-semibold">{stats.pending}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">Delivered:</span>
                  <span className="text-green-400 font-semibold">{stats.delivered}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          {!loading && letters.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search letters by title or content..."
                  className="w-full px-4 py-3 pl-10 pr-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          {!loading && letters.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === 'pending'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('delivered')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === 'delivered'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Delivered
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="delivery">Delivery Date</option>
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <LetterCardSkeleton key={i} />
              ))}
            </div>
          ) : searchFiltered.length === 0 ? (
            /* Empty State */
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-2xl font-bold text-white mb-2">{emptyState.title}</h2>
              <p className="text-purple-200 mb-6">{emptyState.message}</p>
              {emptyState.showCTA && (
                <button
                  onClick={() => navigate('/write')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition"
                >
                  Write Your First Letter
                </button>
              )}
            </div>
          ) : (
            /* Letters Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchFiltered.map((letter) => {
                const daysUntil = calculateDaysUntilDelivery(letter.deliveryDate)
                const isPending = !letter.isDelivered

                return (
                  <div
                    key={letter.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:scale-[1.02] ${
                      letter.isDelivered ? 'opacity-90' : ''
                    }`}
                    onClick={() => handleCardClick(letter.id)}
                  >
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-1">
                      {letter.title || 'Untitled Letter'}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-purple-200 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                      {letter.content}
                    </p>

                    {/* Delivery Date and Status */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-300">
                        <span>📅</span>
                        <span className="font-medium">{formatDate(letter.deliveryDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            letter.isDelivered
                              ? 'text-green-400 bg-green-500/20 border border-green-500/50'
                              : 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/50'
                          }`}
                        >
                          {letter.isDelivered ? '✓ Delivered' : '⏰ Pending'}
                        </span>
                        {isPending && daysUntil > 0 && (
                          <span className="text-xs text-purple-300">
                            {daysUntil === 1 ? '1 day left' : `${daysUntil} days left`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <button
                        onClick={(e) => handleView(e, letter.id)}
                        className="flex-1 px-3 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-200 rounded-lg hover:bg-purple-500/30 transition text-sm font-medium"
                      >
                        View
                      </button>
                      {!letter.isDelivered && (
                        <>
                          <button
                            onClick={(e) => handleEdit(e, letter.id)}
                            className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-200 rounded-lg hover:bg-blue-500/30 transition text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, letter)}
                            className="flex-1 px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            title="Delete Letter"
            message={`Are you sure you want to delete "${letterToDelete?.title || 'this letter'}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isLoading={deleting}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard
