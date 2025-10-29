"use client"
import { useLocale } from '../store/useLocale'
import { languages } from '../lib/i18n'
import { Globe, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSelector() {
  const { lang, setLang } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = languages.find(l => l.code === lang) || languages[0]

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors duration-200 shadow-soft"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{currentLang.nativeName}</span>
        <svg 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-medium overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang(language.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150 ${
                  lang === language.code
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-foreground hover:bg-accent/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{language.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{language.name}</span>
                </span>
                {lang === language.code && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
