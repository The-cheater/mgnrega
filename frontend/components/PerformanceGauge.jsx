"use client"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function PerformanceGauge({ value=0, label }){
  const data = [{ name:'v', value }]
  const fillColor = value >= 75 ? 'hsl(142, 76%, 36%)' : value >= 50 ? 'hsl(221, 83%, 53%)' : 'hsl(38, 92%, 50%)'
  
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border p-6">
      <h3 className="font-semibold text-lg text-foreground mb-4">{label}</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RadialBarChart data={data} startAngle={180} endAngle={0} innerRadius="70%" outerRadius="100%">
            <PolarAngleAxis type="number" domain={[0,100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" cornerRadius={12} fill={fillColor} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-foreground font-serif">{Math.round(value)}%</div>
        <div className="text-sm text-muted-foreground mt-1">Completion Rate</div>
      </div>
    </div>
  )
}
