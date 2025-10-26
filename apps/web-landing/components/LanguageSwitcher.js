import React, { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const LanguageSwitcher = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('eng')
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Swahili', flag: '🇹🇿' }
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode)
    setIsOpen(false)
    // Here you would typically update your i18n context or store the preference
    localStorage.setItem('preferred-language', langCode)
  }

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && languages.find(lang => lang.code === savedLang)) {
      setCurrentLanguage(savedLang)
    }
  }, [languages])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors backdrop-blur-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag} {currentLang.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    currentLanguage === language.code
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {currentLanguage === language.code && (
                    <span className="ml-auto text-primary-600">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                More languages coming soon
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher