import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { lettersAPI } from '../lib/api/letters.js'
import ProtectedRoute from '../components/ProtectedRoute'

function Dashboard() {
  const { user, logout } = useAuth()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLetters()
  }, [])

  const fetchLetters = async () => {
    try {
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

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
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

          {/* Letters List */}
          {loading ? (
            <div className="text-center text-white">Loading letters...</div>
          ) : letters.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-2xl font-bold text-white mb-2">No letters yet</h2>
              <p className="text-purple-200 mb-6">Start writing to your future self!</p>
              <button
                onClick={() => navigate('/write')}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition"
              >
                Write Your First Letter
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => navigate(`/letters/${letter.id}`)}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {letter.title || 'Untitled Letter'}
                  </h3>
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                    {letter.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-purple-300">
                    <span>
                      Delivery: {new Date(letter.deliveryDate).toLocaleDateString()}
                    </span>
                    <span className={letter.isDelivered ? 'text-green-400' : 'text-yellow-400'}>
                      {letter.isDelivered ? '✓ Delivered' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard
