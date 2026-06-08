import { createContext, useContext, useState, useEffect } from 'react'
import { CASTLE, PARCHMENT } from './themes'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'castle')

  useEffect(() => {
    const theme = mode === 'castle' ? CASTLE : PARCHMENT
    const root = document.documentElement
    Object.entries(theme).forEach(([key, val]) => root.style.setProperty(key, val))
    localStorage.setItem('theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const toggle = () => setMode(m => m === 'castle' ? 'parchment' : 'castle')

  return (
    <ThemeContext.Provider value={{ mode, toggle, isCastle: mode === 'castle' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
