import { useState } from 'react';
import DistrictSelector from '../components/district/DistrictSelector';
import InfoCards from '../components/district/InfoCards';
import StateAnalytics from '../components/analytics/StateAnalytics';
import TrendsChart from '../components/charts/TrendsChart';
import DistrictComparison from '../components/comparison/DistrictComparison';
import LocationDetector from '../components/location/LocationDetector';
import LanguageSelector from '../components/common/LanguageSelector';
import OfflineDetector from '../components/common/OfflineDetector';

import { useDistrictData } from '../hooks/useDistrictData';
import { defaultQuery } from '../utils/constants';
import { getTranslation } from '../utils/translations';
import { useQuery } from '@tanstack/react-query';
import { fetchDistrictTrends } from '../services/api';

const Dashboard = () => {
  const [state, setState] = useState(defaultQuery.state);
  const [year, setYear] = useState(defaultQuery.year);
  const [language, setLanguage] = useState('en');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const { data, isLoading, error } = useDistrictData(state, year);

  // Fetch trends for selected district
  const { data: trendsData } = useQuery({
    queryKey: ['districtTrends', selectedDistrictCode],
    queryFn: () => fetchDistrictTrends(selectedDistrictCode),
    enabled: !!selectedDistrictCode,
  });

  const handleSearch = (query) => {
    setState(query.state);
    setYear(query.year);
  };

  const handleStateDetected = (detectedState) => {
    setState(detectedState);
  };

  const handleDistrictClick = (districtCode) => {
    setSelectedDistrictCode(districtCode);
  };

  const t = (key) => getTranslation(language, key);

  return (
    <>
      <OfflineDetector />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 py-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-end px-6 mb-4">
            <LanguageSelector 
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mt-3">
            {t('subtitle')}
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-green-600 font-bold">12.15 Cr</span> beneficiaries in 2025
            </span>
            <span>•</span>
            <span>Largest welfare program in the world</span>
          </div>
        </header>

        {/* Location Detector */}
        <div className="mb-6">
          <LocationDetector onStateDetected={handleStateDetected} />
        </div>

        {/* District Selector */}
        <DistrictSelector onSearch={handleSearch} />

        {/* State Analytics */}
        <div className="mt-8">
          <StateAnalytics stateName={state} year={year} />
        </div>

        {/* Toggle Comparison View */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md"
          >
            {showComparison ? '📊 Show District Data' : '🔄 Compare Districts'}
          </button>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl">⏳</div>
              <p className="text-blue-600 mt-4 text-lg">{t('loading')}</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg">
              <span className="text-4xl block mb-2">⚠️</span>
              {t('error')}: {error.message}
            </div>
          )}
          {!isLoading && !error && !data?.length && (
            <div className="text-center text-gray-600 bg-gray-50 p-8 rounded-lg">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-lg">{t('noData')}</p>
            </div>
          )}
          
          {!isLoading && !error && data?.length > 0 && (
            <>
              {showComparison ? (
                <DistrictComparison stateName={state} year={year} />
              ) : (
                <InfoCards 
                  data={data} 
                  onDistrictClick={(district) => handleDistrictClick(district.district_code)}
                />
              )}
            </>
          )}
        </div>

        {/* Trends Chart */}
        {selectedDistrictCode && trendsData && trendsData.length > 0 && (
          <div className="mt-8">
            <TrendsChart 
              data={trendsData}
              title={`📈 Historical Trends for District`}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t">
          <p>Data Source: Government of India - MGNREGA Portal</p>
          <p className="mt-2">Built for millions of rural Indians 🇮🇳</p>
        </footer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;