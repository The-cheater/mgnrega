"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Users, CalendarCheck2, IndianRupee, Building2 } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import { LineTrend, BarCompare } from '../../../components/TrendChart'
import PerformanceGauge from '../../../components/PerformanceGauge'
import ComparisonTable from '../../../components/ComparisonTable'
import LanguageSelector from '../../../components/LanguageSelector'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../components/ui/carousel'
import { getCurrent, getHistory, getCompare } from '../../../lib/api'
import { formatNumber } from '../../../lib/utils'
import { useLocale } from '../../../store/useLocale'
import { t, relativeTimeLocalized } from '../../../lib/i18n'

export default function DashboardPage(){
  const params = useParams()
  const router = useRouter()
  const code = params?.districtCode
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [compare, setCompare] = useState(null)
  const { lang } = useLocale()

  useEffect(()=>{
    let c=false
    async function load(){
      const [a,b,cx] = await Promise.all([
        getCurrent(code).catch(()=>null),
        getHistory(code).catch(()=>({history:[]})),
        getCompare(code).catch(()=>null)
      ])
      if(!c){ setCurrent(a); setHistory(b?.history||[]); setCompare(cx) }
    }
    if(code) load()
    return ()=>{c=true}
  },[code])

  const monthLabel = (h)=> h.map(it=> it.month || it.label || '')
  const lineData = useMemo(()=> history.map(h=> ({ label: `${h.month}-${h.fin_year}`, value: Number(h.total_households_worked||0) })), [history])
  const barData = useMemo(()=> history.map(h=> ({ label: `${h.month}-${h.fin_year}`, value: Number(h.total_expenditure||0) })), [history])

  if(!current) return <main className="max-w-6xl mx-auto p-4">{t('loading', lang)}</main>

  const latest = current.latest
  const lastUpdated = latest?.last_updated || latest?.updatedAt
  const completionRate = latest && (Number(latest.completed_works||0) / (Number(latest.completed_works||0)+Number(latest.ongoing_works||0) || 1))*100
  const stateCompare = compare?.state_compare

  const colorFor = (key)=> {
    if (!stateCompare || stateCompare[key]==null) return 'yellow'
    return stateCompare[key] >= 0 ? 'green' : 'red'
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{latest.district_name}</h1>
            <p className="text-amber-800/80 text-sm">{t('lastUpdated', lang)}: {relativeTimeLocalized(lastUpdated, lang)}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={()=> router.push('/')} 
              className="px-5 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border border-amber-200 hover:bg-white transition-colors duration-200 font-medium text-sm shadow-sm text-gray-700 hover:shadow"
            >
              {t('changeDistrict', lang)}
            </button>
            <LanguageSelector />
          </div>
        </header>

        <section className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem className="md:basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MetricCard 
                    icon={<Users className="w-8 h-8 text-green-700"/>} 
                    value={latest.total_households_worked} 
                    label={t('metrics.totalFamilies', lang)} 
                    trend={current.comparisons.total_households_worked} 
                    color={colorFor('total_households_worked')}
                    className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                  />
                  <MetricCard 
                    icon={<CalendarCheck2 className="w-8 h-8 text-blue-700"/>} 
                    value={latest.average_days_employment} 
                    label={t('metrics.avgDays', lang)} 
                    trend={current.comparisons.average_days_employment} 
                    color={colorFor('average_days_employment')}
                    className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard 
                    icon={<IndianRupee className="w-8 h-8 text-emerald-600"/>} 
                    value={latest.total_expenditure} 
                    label={t('metrics.totalSpent', lang)} 
                    trend={current.comparisons.total_expenditure} 
                    color={colorFor('total_expenditure')} 
                  />
                  <MetricCard 
                    icon={<Building2 className="w-8 h-8 text-orange-600"/>} 
                    value={latest.completed_works} 
                    label={t('metrics.completedWorks', lang)} 
                    trend={current.comparisons.completed_works} 
                    color={colorFor('completed_works')} 
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineTrend data={lineData} lineKey="value" />
        <BarCompare data={barData} barKey="value" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceGauge value={isFinite(completionRate)? completionRate : 0} label={t('gauge.workCompletionRate', lang)} />
        <ComparisonTable top={compare?.top_districts||[]} peers={compare?.peer_compare||[]} highlightCode={code} />
      </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('details.viewMore', lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl shadow-soft border border-border p-6 hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2 font-serif">{formatNumber(latest.sc_persondays)}</div>
              <div className="text-muted-foreground text-sm font-medium">{t('details.scPersondays', lang)}</div>
            </div>
            
            <div className="bg-card rounded-xl shadow-soft border border-border p-6 hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2 font-serif">{formatNumber(latest.st_persondays)}</div>
              <div className="text-muted-foreground text-sm font-medium">{t('details.stPersondays', lang)}</div>
            </div>
            
            <div className="bg-card rounded-xl shadow-soft border border-border p-6 hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2 font-serif">{formatNumber(latest.women_persondays)}</div>
              <div className="text-muted-foreground text-sm font-medium">{t('details.womenPersondays', lang)}</div>
            </div>
            
            <div className="bg-card rounded-xl shadow-soft border border-border p-6 hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CalendarCheck2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2 font-serif">{formatNumber(latest.households_completed_100_days)}</div>
              <div className="text-muted-foreground text-sm font-medium">{t('details.hh100Days', lang)}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
