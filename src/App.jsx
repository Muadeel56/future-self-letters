import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WriteLetter from './pages/WriteLetter'
import LetterDetail from './pages/LetterDetail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/write" element={<WriteLetter />} />
          <Route path="/letters/:id" element={<LetterDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
