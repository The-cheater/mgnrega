import axios from 'axios';
import { defaultQuery } from '../utils/constants';

// Your backend server
const API_BASE_URL = 'http://localhost:5000/api/mgnrega';

export const fetchDistrictData = async (state, year) => {
  // Fallback to defaults if state/year are undefined or empty
  const effectiveState = state ?? defaultQuery.state;
  const effectiveYear = year ?? defaultQuery.year;

  // Build params with simple keys (no brackets)
  const params = {
    ...(effectiveState ? { state_name: effectiveState } : {}),
    ...(effectiveYear ? { fin_year: effectiveYear } : {}),
    limit: 100,
    offset: 0,
  };

  try {
    // This calls your backend route
    const { data } = await axios.get(`${API_BASE_URL}/districts`, { params });
    // Your backend sends { records: [...] }
    return data.records || [];
  } catch (error) {
    console.error("Error fetching district data:", error);
    throw error;
  }
};

// Get metadata (states and years)
export const fetchMetadata = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/districts/meta`);
    return data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
};

// Get specific district historical data
export const fetchDistrictHistory = async (districtCode) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/districts/${districtCode}`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching district history:", error);
    throw error;
  }
};

// Get state analytics
export const fetchStateAnalytics = async (stateName, year = null) => {
  try {
    const params = year ? { fin_year: year } : {};
    const { data } = await axios.get(`${API_BASE_URL}/analytics/state/${stateName}`, { params });
    return data.analytics || {};
  } catch (error) {
    console.error("Error fetching state analytics:", error);
    throw error;
  }
};

// Get district trends
export const fetchDistrictTrends = async (districtCode) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/trends/district/${districtCode}`);
    return data.trends || [];
  } catch (error) {
    console.error("Error fetching district trends:", error);
    throw error;
  }
};

// Compare districts
export const compareDistricts = async (districtCodes, year = null) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/compare/districts`, {
      districtCodes,
      year
    });
    return data.comparison || [];
  } catch (error) {
    console.error("Error comparing districts:", error);
    throw error;
  }
};

// Get districts by state
export const fetchDistrictsByState = async (stateName, year = null) => {
  try {
    const params = year ? { fin_year: year } : {};
    const { data } = await axios.get(`${API_BASE_URL}/state/${stateName}/districts`, { params });
    return data.districts || [];
  } catch (error) {
    console.error("Error fetching districts by state:", error);
    throw error;
  }
};

// Find nearest district by geolocation
export const findNearestDistrict = async (lat, lon, state = null) => {
  try {
    const params = { lat, lon };
    if (state) params.state = state;
    const { data } = await axios.get(`${API_BASE_URL}/location/nearest`, { params });
    return data;
  } catch (error) {
    console.error("Error finding nearest district:", error);
    throw error;
  }
};