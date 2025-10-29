"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import Spinner from './Spinner'
import { detectByIp, reverseGeocode } from '../lib/api'
import { cn } from '../lib/utils'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'

export default function LocationDetector(){
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState(null)
  const [method, setMethod] = useState('')
  const [error, setError] = useState('')
  const [showManual, setShowManual] = useState(false)
  const { lang } = useLocale()

  useEffect(() => {
    let canceled = false
    async function detect(){
      setLoading(true)
      try {
        if (navigator.geolocation) {
          const pos = await new Promise((res, rej)=> navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy:false, timeout:8000 }))
          const d = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          if (!canceled && d) { setDistrict(d); setMethod('GPS'); setLoading(false); return }
        }
      } catch (e) {}
      try {
        const d = await detectByIp()
        if (!canceled && d) { setDistrict(d); setMethod('IP'); setLoading(false); return }
      } catch (e) {}
      if (!canceled) { setShowManual(true); setLoading(false); setError(t('location.selectPrompt', lang)) }
    }
    detect()
    return () => { canceled = true }
  }, [])

  if (loading) return (
    <div className="flex items-center space-x-3 text-foreground bg-accent px-6 py-4 rounded-lg border border-border">
      <Spinner />
      <div>
        <div className="font-medium">{t('location.finding', lang)}</div>
      </div>
    </div>
  )

  if (district) return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-card rounded-xl shadow-soft border border-border p-6 max-w-2xl">
      <CheckCircle2 className="w-8 h-8 text-secondary flex-shrink-0" />
      <div className="flex-1 text-center md:text-left">
        <div className="font-bold text-xl text-foreground mb-1">{district.district_name}</div>
        <div className="text-sm text-muted-foreground">{t('location.isThisYourDistrict', lang)} • <span className="text-primary font-medium">{method}</span></div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={()=> router.push(`/dashboard/${district.district_code}`)} 
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-soft"
        >
          {t('yes', lang)}
        </button>
        <button 
          onClick={()=> { setDistrict(null); setShowManual(true) }} 
          className="px-6 py-2.5 bg-card border border-border rounded-lg font-medium hover:bg-accent transition-colors"
        >
          {t('no', lang)}
        </button>
      </div>
    </div>
  )

  if (showManual) return (
    <div className={cn("flex items-center space-x-3 px-6 py-4 rounded-lg bg-accent border border-border", error && 'border-red-400 bg-red-50')}>
      <XCircle className={cn("w-6 h-6", error ? 'text-red-600' : 'text-muted-foreground')} />
      <div>
        <div className="font-semibold text-foreground">{error || t('location.selectPrompt', lang)}</div>
        <div className="text-sm text-muted-foreground">{t('manualSelection.available', lang)}</div>
      </div>
    </div>
  )

  return null
}
