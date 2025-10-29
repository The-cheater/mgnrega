"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStates, searchDistricts } from '../lib/api'
import { t } from '../lib/i18n'
import { useLocale } from '../store/useLocale'
import { Button } from './ui/button'

export default function DistrictSelector(){
  const router = useRouter()
  const { lang } = useLocale()
  const [states, setStates] = useState([])
  const [state, setState] = useState('')
  const [districts, setDistricts] = useState([])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let c=false
    async function loadStates(){
      const data = await getStates().catch(()=>[])
      if(!c){ setStates(data); if(data.includes('ODISHA')) setState('ODISHA'); else setState(data[0]||'') }
    }
    loadStates()
    return ()=>{c=true}
  },[])

  useEffect(()=>{
    let c=false
    async function loadDistricts(){
      if(!state) { setDistricts([]); return }
      setLoading(true)
      const data = await searchDistricts(state).catch(()=>[])
      if(!c){ setDistricts(data); setLoading(false) }
    }
    loadDistricts()
    return ()=>{c=true}
  },[state])

  const selected = useMemo(()=> districts.find(d=> d.district_code===code) || null, [districts, code])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          value={state} 
          onChange={e=> { setState(e.target.value); setCode('') }} 
          className="px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="" disabled>{t('state', lang)}</option>
          {states.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          value={code} 
          onChange={e=> setCode(e.target.value)} 
          className="px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="" disabled>{loading? t('loading', lang) : t('selectDistrict', lang)}</option>
          {districts.map(d=> <option key={d.district_code} value={d.district_code}>{d.district_name}</option>)}
        </select>
        <Button 
          disabled={!code} 
          onClick={()=> router.push(`/dashboard/${code}`)}
          className="h-auto py-3"
        >
          {t('viewDashboard', lang)}
        </Button>
      </div>
      {selected && <div className="text-sm text-muted-foreground mt-3 text-center">{selected.state_name}</div>}
    </div>
  )
}
