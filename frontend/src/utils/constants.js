export const STATES = [
  { value: 'ANDHRA PRADESH', label: 'Andhra Pradesh' },
  { value: 'ANDAMAN AND NICOBAR', label: 'Andaman and Nicobar' },
  { value: 'ARUNACHAL PRADESH', label: 'Arunachal Pradesh' },
  { value: 'ASSAM', label: 'Assam' },
  { value: 'BIHAR', label: 'Bihar' },
  { value: 'CHANDIGARH', label: 'Chandigarh' },
  { value: 'CHHATTISGARH', label: 'Chhattisgarh' },
  { value: 'DADRA AND NAGAR HAVELI', label: 'Dadra and Nagar Haveli' },
  { value: 'DAMAN AND DIU', label: 'Daman and Diu' },
  { value: 'GOA', label: 'Goa' },
  { value: 'GUJARAT', label: 'Gujarat' },
  { value: 'HARYANA', label: 'Haryana' },
  { value: 'HIMACHAL PRADESH', label: 'Himachal Pradesh' },
  { value: 'JAMMU AND KASHMIR', label: 'Jammu and Kashmir' },
  { value: 'JHARKHAND', label: 'Jharkhand' },
  { value: 'KARNATAKA', label: 'Karnataka' },
  { value: 'KERALA', label: 'Kerala' },
  { value: 'LADAKH', label: 'Ladakh' },
  { value: 'LAKSHADWEEP', label: 'Lakshadweep' },
  { value: 'MADHYA PRADESH', label: 'Madhya Pradesh' },
  { value: 'MAHARASHTRA', label: 'Maharashtra' },
  { value: 'MANIPUR', label: 'Manipur' },
  { value: 'MEGHALAYA', label: 'Meghalaya' },
  { value: 'MIZORAM', label: 'Mizoram' },
  { value: 'NAGALAND', label: 'Nagaland' },
  { value: 'ODISHA', label: 'Odisha' },
  { value: 'PUDUCHERRY', label: 'Puducherry' },
  { value: 'PUNJAB', label: 'Punjab' },
  { value: 'RAJASTHAN', label: 'Rajasthan' },
  { value: 'SIKKIM', label: 'Sikkim' },
  { value: 'TAMIL NADU', label: 'Tamil Nadu' },
  { value: 'TELANGANA', label: 'Telangana' },
  { value: 'TRIPURA', label: 'Tripura' },
  { value: 'UTTAR PRADESH', label: 'Uttar Pradesh' },
  { value: 'UTTARAKHAND', label: 'Uttarakhand' },
  { value: 'WEST BENGAL', label: 'West Bengal' },
];

// Use the YYYY-YYYY format that matches your CSV data
export const FINANCIAL_YEARS = [
  '2025-2026', 
  '2024-2025',
  '2023-2024',
  '2022-2023',
];

// --- DEFINE DEFAULT QUERY LAST ---
// This now correctly uses the arrays defined above
export const defaultQuery = {
  // Default to a state we know has data
  state: STATES[0].value, // 'ANDHRA PRADESH'
  
  // Default to the year we have data for
  year: FINANCIAL_YEARS[0], // '2025-2026'
};