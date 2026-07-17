import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import About from './components/About'
import Contact from './components/Contact'
import Products from './components/Products'

function App() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Tarayıcı hafızasına bak: Daha önce girildi mi?
    const hasVisited = sessionStorage.getItem('hasVisited')

    if (!hasVisited) {
      // İlk giriş: Hoş geldiniz ekranını göster
      setShowWelcome(true)
      
      // 2 saniye sonra ekranı kapat ve "girildi" işaretini kaydet
      const timer = setTimeout(() => {
        setShowWelcome(false)
        sessionStorage.setItem('hasVisited', 'true')
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  if (showWelcome) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a192f]">
        <h1 className="text-5xl md:text-6xl font-black text-white animate-pulse text-center px-4">
          HAS DOOR'A HOŞ GELDİNİZ
        </h1>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a192f]">
        <Navbar />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={
              <div className="relative w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center">
                <img 
                  src="/logo1.png" 
                  alt="Has Door" 
                  className="max-w-[90%] max-h-[80%] object-contain" 
                />
                <div className="absolute bottom-0 w-full bg-black/30 py-6 backdrop-blur-sm">
                  <p className="text-white text-xl md:text-2xl font-light text-center tracking-widest uppercase">
                    Asansör Kapılarında Kalite
                  </p>
                </div>
              </div>
            } />
            
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/urunler" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App