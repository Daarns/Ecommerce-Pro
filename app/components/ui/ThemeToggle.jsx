'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getStoredTheme, setStoredTheme } from '@/app/lib/utils'

export function ThemeToggle() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const savedTheme = getStoredTheme()
    setTheme(savedTheme)    
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setStoredTheme(newTheme)
  }
  
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-background-secondary animate-pulse"></div>
    )
  }
  
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-background-secondary hover:bg-background-tertiary transition-colors group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 w-5 h-5 text-text-secondary transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
        }`} />
        <Moon className={`absolute inset-0 w-5 h-5 text-text-secondary transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
        }`} />
      </div>
    </button>
  )
}