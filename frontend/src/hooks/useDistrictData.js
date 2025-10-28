import { useQuery } from '@tanstack/react-query';
import { fetchDistrictData } from '../services/api';

// --- THIS IS THE FIX ---
// Change this from 'const useDistrictData' to 'export const useDistrictData'
// This makes it a named export.
export const useDistrictData = (state, year) => {
  return useQuery({
    queryKey: ['districtData', state, year],
    queryFn: () => fetchDistrictData(state, year),
    
    // This correctly waits for state and year to be ready
    enabled: !!state && !!year, 
  });
};

// DO NOT have 'export default useDistrictData' at the bottom