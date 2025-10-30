"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, MapPin, MapPinned, XCircle, LocateFixed, Loader2 } from 'lucide-react'
import { detectByIp, reverseGeocode } from '../lib/api'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import { Button } from './ui/button'

// Helper function to handle API errors
const handleApiError = (error, setError, lang) => {
  console.error('Location detection error:', error);
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      t('location.errorDetecting', lang);
  setError(errorMessage);
  return null;
};

export default function LocationDetectionCard({ onLocationDetected, onManualSelect }) {
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState(null)
  const [method, setMethod] = useState('')
  const [error, setError] = useState('')
  const [showManual, setShowManual] = useState(false)
  const { lang } = useLocale()
  const router = useRouter()

  useEffect(() => {
    let canceled = false
    
    async function detect() {
      setLoading(true)
      setError('')
      setDistrict(null)
      setMethod('')

      // Try GPS first if available
      if (navigator.geolocation) {
        try {
          setLoading(true)
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve, 
              reject, 
              { 
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 0 // Force fresh location
              }
            )
          })
          
          if (canceled) return
          
          // Show detecting state
          setLoading(true)
          
          try {
            const d = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            if (canceled) return
            
            if (d) {
              setDistrict(d)
              setMethod('GPS')
              setLoading(false)
              return
            }
          } catch (e) {
            console.warn('Reverse geocoding failed, falling back to IP detection')
          }
        } catch (e) {
          console.warn('Geolocation failed, falling back to IP detection')
        }
      }

      // Fallback to IP detection
      try {
        if (canceled) return
        setLoading(true)
        
        const d = await detectByIp()
        if (canceled) return
        
        if (d) {
          setDistrict(d)
          setMethod('IP')
          setLoading(false)
          return
        }
      } catch (e) {
        console.error('IP detection failed:', e)
        if (!canceled) {
          setError(t('location.errorDetecting', lang))
        }
      }

      // If we get here, all methods failed
      if (!canceled) {
        setShowManual(true)
        setLoading(false)
      }
    }
    
    // Start detection
    detect()
    
    // Cleanup function
    return () => {
      canceled = true
    }
  }, [lang])

  const handleUseThisLocation = () => {
    if (district) {
      onLocationDetected?.(district)
    }
  }

  const handleManualSelect = () => {
    onManualSelect?.()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div className="absolute -inset-2 border-4 border-blue-100 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {method === 'GPS' 
                ? 'Finding your precise location...'
                : 'Approximating your location...'}
            </h2>
            <p className="text-gray-500 text-sm max-w-xs">
              {method === 'GPS' 
                ? 'Using your device\'s GPS for accurate results'
                : 'Using your IP address to estimate your location'}
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (district && !showManual) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <MapPinned className="w-8 h-8 text-green-600" />
            </div>
            <div className="absolute -inset-2 border-4 border-green-100 rounded-full"></div>
          </div>
          
          <div className="space-y-3 w-full">
            <h2 className="text-2xl font-bold text-gray-900">
              We found your location!
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 w-full text-left">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">
                  {method === 'GPS' 
                    ? 'Detected via your device location' 
                    : 'Estimated from your internet connection'}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{district.district_name}</p>
              <p className="text-sm text-gray-600">{district.state_name}</p>
            </div>
            
            <p className="text-sm text-gray-500 pt-2">
              Is this your correct location?
            </p>
          </div>
          
          <div className="flex flex-col w-full space-y-3">
            <Button 
              onClick={handleUseThisLocation}
              className="w-full py-3 text-base font-medium bg-green-600 hover:bg-green-700 transition-colors"
              size="lg"
            >
              Yes, this is correct
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowManual(true)}
              className="w-full py-3 text-base font-medium"
              size="lg"
            >
              No, choose manually
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto">
      <div className="flex flex-col items-center text-center space-y-6">
        {error ? (
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        ) : (
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <LocateFixed className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute -inset-2 border-4 border-blue-100 rounded-full"></div>
          </div>
        )}
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {error ? 'Location Not Found' : 'Select Your Location'}
          </h2>
          
          {error ? (
            <p className="text-red-500 text-sm">
              We couldn't determine your location automatically. Please select it manually.
            </p>
          ) : (
            <p className="text-gray-500">
              Choose your location to see relevant MGNREGA data for your area
            </p>
          )}
        </div>
        
        <div className="flex flex-col w-full space-y-3">
          <Button 
            onClick={handleManualSelect}
            className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
            size="lg"
          >
            Select Location Manually
          </Button>
          
          {error && (
            <Button 
              variant="outline"
              onClick={() => {
                setError('')
                setLoading(true)
                setShowManual(false)
              }}
              className="w-full py-3 text-base font-medium"
              size="lg"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
