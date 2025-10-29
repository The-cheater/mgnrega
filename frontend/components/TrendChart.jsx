"use client"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'

export function LineTrend({ data, lineKey='value', color='hsl(221, 83%, 53%)' }){
  const { lang } = useLocale()
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border p-6">
      <h3 className="font-semibold text-lg text-foreground mb-4">{t('charts.last12Months', lang)}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
          <XAxis 
            dataKey="label" 
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            stroke="hsl(214, 32%, 91%)"
          />
          <YAxis 
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            stroke="hsl(214, 32%, 91%)"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(0, 0%, 100%)', 
              border: '1px solid hsl(214, 32%, 91%)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={lineKey} 
            stroke={color} 
            strokeWidth={3} 
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarCompare({ data, barKey='value', color='hsl(142, 76%, 36%)' }){
  const { lang } = useLocale()
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border p-6">
      <h3 className="font-semibold text-lg text-foreground mb-4">{t('charts.monthlyExpenditure', lang)}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
          <XAxis 
            dataKey="label" 
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            stroke="hsl(214, 32%, 91%)"
          />
          <YAxis 
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            stroke="hsl(214, 32%, 91%)"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(0, 0%, 100%)', 
              border: '1px solid hsl(214, 32%, 91%)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey={barKey} fill={color} radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
