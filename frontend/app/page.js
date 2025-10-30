"use client"
import { useState } from 'react'
import LocationDetectionCard from '../components/LocationDetectionCard'
import DistrictSelector from '../components/DistrictSelector'
import LanguageSelector from '../components/LanguageSelector'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { lang } = useLocale()
  const router = useRouter()
  const [showDistrictSelector, setShowDistrictSelector] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const handleLocationDetected = (district) => {
    setSelectedDistrict(district)
    setShowDistrictSelector(true)
  }

  const handleManualSelect = () => {
    setShowDistrictSelector(true)
  }

  const handleViewDashboard = (districtCode) => {
    router.push(`/dashboard/${districtCode}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" 
          style={{
            backgroundImage: 'url(/background1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(246, 246, 246, 0.8)',
            backgroundBlendMode: 'overlay'
          }}>
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>
        
        {!showDistrictSelector ? (
          <div className="space-y-8">
            <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 text-center transform transition-all duration-300">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8 text-balance leading-tight">
                {t('home.title', lang)}
              </h1>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('', lang)}
              </p>
              <div className="flex justify-center">
                <LocationDetectionCard 
                  onLocationDetected={handleLocationDetected}
                  onManualSelect={handleManualSelect}
                />
              </div>
            </section>
          </div>
        ) : (
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 transform transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {t('Track Your District Performance', lang)}
            </h2>
            <div className="space-y-6">
              <DistrictSelector onSelectDistrict={handleViewDashboard} />
              {selectedDistrict && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleViewDashboard(selectedDistrict.district_code)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {t('orViewDashboardFor', { district: selectedDistrict.district_name }, lang)}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
