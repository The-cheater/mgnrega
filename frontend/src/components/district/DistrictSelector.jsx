import React, { useState } from 'react';
// Import the corrected arrays
import { STATES, FINANCIAL_YEARS, defaultQuery } from '../../utils/constants';

export const DistrictSelector = ({ onSearch }) => {
  // Use the default query to set the *internal* state of the dropdowns
  const [localState, setLocalState] = useState(defaultQuery.state);
  const [localYear, setLocalYear] = useState(defaultQuery.year);

  const handleSearchClick = () => {
    // When "Search" is clicked, pass the internal state up to the Dashboard
    onSearch({ state: localState, year: localYear });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
      {/* --- State Dropdown --- */}
      <div className="flex flex-col">
        <label htmlFor="state-select" className="block mb-1 font-medium text-gray-700">State</label>
        <select
          id="state-select"
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          className="p-3 text-lg bg-white border border-gray-300 rounded-lg"
        >
          {/* Map over the STATES array */}
          {STATES.map((s) => (
            <option value={s.value} key={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- Year Dropdown --- */}
      <div className="flex flex-col">
        <label htmlFor="year-select" className="block mb-1 font-medium text-gray-700">Financial Year</label>
        <select
          id="year-select"
          value={localYear}
          onChange={(e) => setLocalYear(e.target.value)}
          className="p-3 text-lg bg-white border border-gray-300 rounded-lg"
        >
          {/* Map over the FINANCIAL_YEARS array */}
          {FINANCIAL_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* --- Search Button --- */}
      <div className="mt-auto pt-6 sm:pt-0">
        <button
          type="button"
          className="w-full px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default DistrictSelector;
