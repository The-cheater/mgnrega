import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { compareDistricts, fetchDistrictsByState } from '../../services/api';
import Card from '../common/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DistrictComparison = ({ stateName, year }) => {
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [comparisonMetric, setComparisonMetric] = useState('totalExpenditure');

  // Fetch all districts in the state
  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ['districtsByState', stateName, year],
    queryFn: () => fetchDistrictsByState(stateName, year),
    enabled: !!stateName,
  });

  // Fetch comparison data
  const { data: comparison, isLoading: loadingComparison } = useQuery({
    queryKey: ['compareDistricts', selectedDistricts, year],
    queryFn: () => compareDistricts(selectedDistricts, year),
    enabled: selectedDistricts.length >= 2,
  });

  const handleDistrictToggle = (districtCode) => {
    setSelectedDistricts(prev => {
      if (prev.includes(districtCode)) {
        return prev.filter(d => d !== districtCode);
      } else if (prev.length < 5) {
        return [...prev, districtCode];
      }
      return prev;
    });
  };

  const metrics = [
    { key: 'totalExpenditure', label: 'Total Expenditure', format: (v) => `₹${(v / 100000).toFixed(2)}L` },
    { key: 'totalWorkers', label: 'Total Workers', format: (v) => v.toLocaleString() },
    { key: 'totalHouseholdsWorked', label: 'Households Worked', format: (v) => v.toLocaleString() },
    { key: 'avgWageRate', label: 'Avg Wage Rate', format: (v) => `₹${v.toFixed(2)}` },
    { key: 'completedWorks', label: 'Completed Works', format: (v) => v.toLocaleString() },
  ];

  const chartData = comparison?.map(d => ({
    name: d.district_name,
    [comparisonMetric]: d[comparisonMetric] || 0,
  })) || [];

  return (
    <Card title="🔄 Compare Districts">
      <div className="space-y-4">
        {/* District Selection */}
        <div>
          <h4 className="font-semibold mb-2">Select Districts (Max 5):</h4>
          {loadingDistricts ? (
            <div className="text-center py-4">Loading districts...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {districts?.map(district => (
                <label
                  key={district.district_code}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    selectedDistricts.includes(district.district_code)
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDistricts.includes(district.district_code)}
                    onChange={() => handleDistrictToggle(district.district_code)}
                    disabled={!selectedDistricts.includes(district.district_code) && selectedDistricts.length >= 5}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{district.district_name}</span>
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Selected: {selectedDistricts.length}/5
          </p>
        </div>

        {/* Metric Selection */}
        {selectedDistricts.length >= 2 && (
          <>
            <div>
              <h4 className="font-semibold mb-2">Comparison Metric:</h4>
              <select
                value={comparisonMetric}
                onChange={(e) => setComparisonMetric(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {metrics.map(m => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Comparison Chart */}
            {loadingComparison ? (
              <div className="text-center py-8">Loading comparison...</div>
            ) : chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => {
                        const metric = metrics.find(m => m.key === comparisonMetric);
                        return metric ? metric.format(value) : value;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey={comparisonMetric} 
                      fill="#3b82f6"
                      name={metrics.find(m => m.key === comparisonMetric)?.label}
                    />
                  </BarChart>
                </ResponsiveContainer>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">District</th>
                        {metrics.map(m => (
                          <th key={m.key} className="p-2 text-right">{m.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison?.map((d, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-semibold">{d.district_name}</td>
                          {metrics.map(m => (
                            <td key={m.key} className="p-2 text-right">
                              {m.format(d[m.key] || 0)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comparison data available
              </div>
            )}
          </>
        )}

        {selectedDistricts.length < 2 && (
          <div className="text-center py-8 text-gray-500">
            Select at least 2 districts to compare
          </div>
        )}
      </div>
    </Card>
  );
};

export default DistrictComparison;
