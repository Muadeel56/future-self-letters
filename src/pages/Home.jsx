import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Logo/Icon */}
          <div className="mb-8">
            <span className="text-6xl">💌</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Future Self Letters
          </h1>
          
          {/* Subheading */}
          <p className="text-xl text-purple-200 mb-10 leading-relaxed">
            Write a letter to your future self. Set goals, share dreams, 
            and reconnect with who you were. Your words will find you 
            when the time is right.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-purple-500 text-white rounded-xl font-semibold text-lg hover:bg-purple-400 transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Start Writing
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
          
          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Write Letters</h3>
              <p className="text-purple-200/80 text-sm">Pour your thoughts, dreams, and goals into letters for your future self.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-white mb-2">Schedule Delivery</h3>
              <p className="text-purple-200/80 text-sm">Choose when to receive your letter - days, months, or years from now.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Surprised</h3>
              <p className="text-purple-200/80 text-sm">Receive your letter and reflect on how far you have come.</p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}

export default Home

