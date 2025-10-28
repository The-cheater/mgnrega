import React, { useState } from 'react';
import Card from '../common/Card';
import { getExplanation, formatValue } from '../../utils/explanations';

const MetricRow = ({ label, value, fieldKey, icon, showTooltip = true }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const explanation = getExplanation(fieldKey);

  return (
    <div className="relative py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl" role="img" aria-label={label}>
            {icon || explanation?.icon || '📊'}
          </span>
          <div className="flex-1">
            <span className="text-sm text-gray-600 block">{label}</span>
            {explanation?.simple && (
              <span className="text-xs text-gray-400 italic">{explanation.simple}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-blue-800">{formatValue(fieldKey, value)}</span>
          {showTooltip && explanation && (
            <button
              onMouseEnter={() => setShowExplanation(true)}
              onMouseLeave={() => setShowExplanation(false)}
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-blue-500 hover:text-blue-700 cursor-help"
            >
              ℹ️
            </button>
          )}
        </div>
      </div>
      {showExplanation && explanation && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
          {explanation.text}
        </div>
      )}
    </div>
  );
};

const InfoCards = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
        <span className="text-4xl block mb-2">📭</span>
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {data.map((item, index) => (
        <Card key={index} title={`📍 ${item.district_name || 'N/A'}`} className="hover:shadow-xl transition-shadow">
          <div className="space-y-1">
            <MetricRow
              label="Total Workers"
              value={item.Total_No_of_Workers}
              fieldKey="Total_No_of_Workers"
            />
            <MetricRow
              label="Families That Got Work"
              value={item.Total_Households_Worked}
              fieldKey="Total_Households_Worked"
            />
            <MetricRow
              label="Total Money Spent"
              value={item.Total_Exp}
              fieldKey="Total_Exp"
            />
            <MetricRow
              label="Wages Paid"
              value={item.Wages}
              fieldKey="Wages"
            />
            <MetricRow
              label="Average Daily Wage"
              value={item.Average_Wage_rate_per_day_per_person}
              fieldKey="Average_Wage_rate_per_day_per_person"
            />
            <MetricRow
              label="Completed Projects"
              value={item.Number_of_Completed_Works}
              fieldKey="Number_of_Completed_Works"
            />
            <MetricRow
              label="Ongoing Projects"
              value={item.Number_of_Ongoing_Works}
              fieldKey="Number_of_Ongoing_Works"
            />
            <MetricRow
              label="Women Work Days"
              value={item.Women_Persondays}
              fieldKey="Women_Persondays"
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InfoCards;