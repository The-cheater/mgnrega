import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStateAnalytics } from '../../services/api';
import Card from '../common/Card';
import { formatValue } from '../../utils/explanations';

const StateAnalytics = ({ stateName, year }) => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['stateAnalytics', stateName, year],
    queryFn: () => fetchStateAnalytics(stateName, year),
    enabled: !!stateName,
  });

  if (isLoading) {
    return (
      <Card title="📊 State-Level Analytics">
        <div className="text-center py-8">
          <div className="animate-pulse">Loading analytics...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="📊 State-Level Analytics">
        <div className="text-center py-8 text-red-600">
          Error loading analytics
        </div>
      </Card>
    );
  }

  if (!analytics || Object.keys(analytics).length === 0) {
    return null;
  }

  const metrics = [
    {
      label: 'Total Workers',
      value: analytics.totalWorkers,
      icon: '👷',
      color: 'blue'
    },
    {
      label: 'Total Households',
      value: analytics.totalHouseholdsWorked,
      icon: '🏠',
      color: 'green'
    },
    {
      label: 'Total Expenditure',
      value: `₹${Number(analytics.totalExpenditure || 0).toLocaleString('en-IN')}`,
      icon: '💰',
      color: 'yellow'
    },
    {
      label: 'Total Wages',
      value: `₹${Number(analytics.totalWages || 0).toLocaleString('en-IN')}`,
      icon: '💵',
      color: 'purple'
    },
    {
      label: 'Avg Wage Rate',
      value: `₹${Number(analytics.avgWageRate || 0).toFixed(2)}`,
      icon: '📊',
      color: 'indigo'
    },
    {
      label: 'Avg Days/Household',
      value: Number(analytics.avgDaysEmployment || 0).toFixed(1),
      icon: '📅',
      color: 'pink'
    },
    {
      label: 'Completed Works',
      value: analytics.totalCompletedWorks,
      icon: '✅',
      color: 'green'
    },
    {
      label: 'Ongoing Works',
      value: analytics.totalOngoingWorks,
      icon: '🚧',
      color: 'orange'
    },
  ];

  return (
    <Card title={`📊 ${stateName} - State Analytics`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-lg text-center hover:shadow-md transition-shadow`}
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {typeof metric.value === 'number' ? metric.value.toLocaleString('en-IN') : metric.value}
            </div>
            <div className="text-xs text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Data from {analytics.districtsCount || 0} districts
      </div>
    </Card>
  );
};

export default StateAnalytics;
