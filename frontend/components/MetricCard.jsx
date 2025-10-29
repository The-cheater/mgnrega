"use client"
import { cn, formatNumber } from '../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MetricCard({ icon, value, label, hindiLabel, trend, color='green', onClick }){
  const borderColor = color==='green'?'border-secondary/30':color==='yellow'?'border-yellow-400/30':'border-red-400/30'
  const bgColor = color==='green'?'bg-secondary/5':color==='yellow'?'bg-yellow-50':'bg-red-50'
  const trendColor = color==='green'?'text-secondary':color==='yellow'?'text-yellow-600':'text-red-600'
  const iconBg = color==='green'?'bg-secondary/10':color==='yellow'?'bg-yellow-100':'bg-red-100'
  
  return (
    <div onClick={onClick} className={cn("bg-card rounded-xl shadow-soft border border-border hover:shadow-medium transition-all duration-200 cursor-pointer overflow-hidden", borderColor)}>
      <div className={cn("h-1", bgColor)} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-lg", iconBg)}>{icon}</div>
          {trend?.pct!=null && (
            <div className={cn("flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md", trendColor, bgColor)}>
              {trend.pct > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend.pct).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif">{formatNumber(value)}</div>
        <div className="text-muted-foreground text-sm font-medium">{label}</div>
        {hindiLabel ? <div className="text-muted-foreground text-xs mt-1">{hindiLabel}</div> : null}
      </div>
    </div>
  )
}
