import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <p className="text-slate-400">Coming in Milestone 2</p>
        <Link to="/" className="text-purple-400 hover:underline mt-4 block">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Login

