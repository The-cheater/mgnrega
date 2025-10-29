"use client"
import LocationDetector from '../components/LocationDetector'
import DistrictSelector from '../components/DistrictSelector'
import LanguageSelector from '../components/LanguageSelector'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import Image from 'next/image'

export default function Home() {
  const { lang } = useLocale()
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>
        
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 text-center transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
            {t('home.title', lang)}
          </h1>
          <div className="flex justify-center mb-8">
            <LocationDetector />
          </div>
          <DistrictSelector />
        </section>
      </div>
    </main>
  )
}
