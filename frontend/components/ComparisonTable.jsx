"use client"
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import { Award, TrendingUp, TrendingDown } from 'lucide-react'

export default function ComparisonTable({ top=[], peers=[], highlightCode }){
  const { lang } = useLocale()
  
  // Show top 5 districts
  const topDistricts = top.slice(0, 5)
  
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border p-6">
      <h3 className="font-semibold text-xl text-foreground mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-primary" />
        {t('compare.title', lang)}
      </h3>
      
      <div className="space-y-3">
        {topDistricts.map((district, i) => {
          const isHighlighted = highlightCode === district.district_code
          const rankColors = [
            'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
            'bg-gradient-to-br from-gray-300 to-gray-500 text-white',
            'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
            'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
            'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700'
          ]
          
          return (
            <div
              key={district.district_code}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                isHighlighted 
                  ? 'bg-primary/10 border-2 border-primary shadow-md' 
                  : 'bg-accent/50 hover:bg-accent border border-border'
              }`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${rankColors[i]}`}>
                {i + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">
                  {district.district_name}
                  {isHighlighted && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {district.total_households_worked?.toLocaleString()} {t('table.households', lang)}
                </div>
              </div>
              
              {isHighlighted && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {peers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t('table.similar', lang)}
          </h4>
          <div className="space-y-2">
            {peers.slice(0, 3).map((peer) => (
              <div
                key={peer.district_code}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent transition-colors"
              >
                <span className="font-medium text-foreground text-sm">{peer.district_name}</span>
                {peer.diffs?.total_households_worked != null && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    peer.diffs.total_households_worked > 0 ? 'text-secondary' : 'text-red-600'
                  }`}>
                    {peer.diffs.total_households_worked > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(peer.diffs.total_households_worked).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
