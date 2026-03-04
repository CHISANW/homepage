import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import GitHubActivity from './components/GitHubActivity'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import FloatingWidgets from './components/FloatingWidgets'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHubActivity darkMode={darkMode} />
        <Blog />
        <Contact />
      </main>
      <Footer />
      {/* ── 플로팅 위젯 (방문자 수 + 좋아요) ── */}
      <FloatingWidgets />
      {/* ── 챗봇 ── */}
      <ChatBot />
    </div>
  )
}

export default App
