import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../common/Card';

const TrendsChart = ({ data, title = "Trends Over Time" }) => {
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('Total_Exp');

  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <div className="text-center py-8 text-gray-500">
          No trend data available
        </div>
      </Card>
    );
  }

  const metrics = [
    { key: 'Total_Exp', label: 'Total Expenditure', color: '#8884d8' },
    { key: 'Wages', label: 'Wages', color: '#82ca9d' },
    { key: 'Total_Households_Worked', label: 'Households Worked', color: '#ffc658' },
    { key: 'Total_No_of_Workers', label: 'Workers', color: '#ff7c7c' },
    { key: 'Women_Persondays', label: 'Women Persondays', color: '#a78bfa' },
  ];

  const processedData = data.map(item => ({
    period: `${item.month || ''} ${item.fin_year || ''}`.trim(),
    ...item
  }));

  const formatValue = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  return (
    <Card title={title}>
      <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded ${
              chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            📈 Line Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded ${
              chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            📊 Bar Chart
          </button>
        </div>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="px-4 py-2 border rounded bg-white"
        >
          {metrics.map(m => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="period" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatValue}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => formatValue(value)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <DataComponent
            type="monotone"
            dataKey={selectedMetric}
            stroke={metrics.find(m => m.key === selectedMetric)?.color || '#8884d8'}
            fill={metrics.find(m => m.key === selectedMetric)?.color || '#8884d8'}
            name={metrics.find(m => m.key === selectedMetric)?.label || selectedMetric}
          />
        </ChartComponent>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {data.length} data points
      </div>
    </Card>
  );
};

export default TrendsChart;
