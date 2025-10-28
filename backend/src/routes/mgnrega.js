import { Router } from 'express';
import DistrictData from '../models/DistrictData.js'; // Import your model

const router = Router();

router.get('/districts', async (req, res) => {
  try {
    // Accept multiple formats:
    // 1. Direct: ?state_name=X&fin_year=Y
    // 2. Nested object (Express parses filters[x] as req.query.filters.x): ?filters[state_name]=X
    // 3. Bracketed string key: ?filters%5Bstate_name%5D=X (rare, but handle it)
    const state = req.query.state_name || req.query.filters?.state_name || req.query['filters[state_name]'];
    const year = req.query.fin_year || req.query.filters?.fin_year || req.query['filters[fin_year]'];

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const normalize = (s) => (typeof s === 'string' ? s.trim() : '');
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactCI = (s) => new RegExp(`^${escapeRegex(s)}$`, 'i');
    const toShortYear = (y) => {
      const m = /^([0-9]{4})-([0-9]{4})$/.exec(y);
      if (!m) return null;
      return `${m[1]}-${m[2].slice(2)}`;
    };

    const conditions = [];
    const normState = normalize(state);
    const normYear = normalize(year);

    if (normState) {
      conditions.push({ state_name: exactCI(normState) });
    }

    if (normYear) {
      const alt = toShortYear(normYear);
      if (alt) {
        conditions.push({ $or: [{ fin_year: exactCI(normYear) }, { fin_year: exactCI(alt) }] });
      } else {
        conditions.push({ fin_year: exactCI(normYear) });
      }
    }

    const query = conditions.length ? { $and: conditions } : {};

    // Detailed logging for debugging incoming queries
    console.log('--- NEW QUERY RECEIVED ---');
    console.log('URL:', req.originalUrl);
    console.log('Raw req.query:', req.query);
    console.log('Query Params:', { state: normState || undefined, year: normYear || undefined });
    console.log('MongoDB Query:', query);

    const records = await DistrictData.find(query)
      .limit(limit)
      .skip(offset);
      
    const total = await DistrictData.countDocuments(query);
    const collectionTotal = await DistrictData.countDocuments({});

    console.log(`Found ${records.length} records (Total matching query: ${total}, Collection total: ${collectionTotal})`);

    res.json({
      status: 'ok',
      message: 'Resource lists from local database',
      total: total,
      count: records.length,
      limit: limit,
      offset: offset,
      records: records,
    });

  } catch (err) {
    console.error('Error fetching data from database:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Metadata endpoint: distinct states and years
router.get('/districts/meta', async (req, res) => {
  try {
    const states = await DistrictData.distinct('state_name');
    const years = await DistrictData.distinct('fin_year');
    res.json({ status: 'ok', states: states.sort(), years: years.sort() });
  } catch (err) {
    console.error('Error fetching metadata:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get specific district data with historical trends
router.get('/districts/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const data = await DistrictData.find({ district_code: districtCode }).sort({ fin_year: -1, month: 1 });
    res.json({ status: 'ok', data });
  } catch (err) {
    console.error('Error fetching district data:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Analytics endpoint: Get aggregated statistics for a state
router.get('/analytics/state/:stateName', async (req, res) => {
  try {
    const { stateName } = req.params;
    const year = req.query.fin_year;

    const query = { state_name: new RegExp(`^${stateName}$`, 'i') };
    if (year) {
      query.fin_year = new RegExp(`^${year}$`, 'i');
    }

    const analytics = await DistrictData.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalWorkers: { $sum: '$Total_No_of_Workers' },
          totalHouseholdsWorked: { $sum: '$Total_Households_Worked' },
          totalExpenditure: { $sum: '$Total_Exp' },
          totalWages: { $sum: '$Wages' },
          totalWomenPersondays: { $sum: '$Women_Persondays' },
          totalSCPersondays: { $sum: '$ST_persondays' },
          totalSTPersondays: { $sum: '$ST_persondays' },
          avgWageRate: { $avg: '$Average_Wage_rate_per_day_per_person' },
          avgDaysEmployment: { $avg: '$Average_days_of_employment_provided_per_Household' },
          totalCompletedWorks: { $sum: '$Number_of_Completed_Works' },
          totalOngoingWorks: { $sum: '$Number_of_Ongoing_Works' },
          districtsCount: { $sum: 1 }
        }
      }
    ]);

    res.json({ status: 'ok', analytics: analytics[0] || {} });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Trends endpoint: Get time series data for a district
router.get('/trends/district/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const trends = await DistrictData.find({ district_code: districtCode })
      .sort({ fin_year: 1, month: 1 })
      .select('fin_year month Total_Exp Total_Households_Worked Total_No_of_Workers Wages Women_Persondays');

    res.json({ status: 'ok', trends });
  } catch (err) {
    console.error('Error fetching trends:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Comparison endpoint: Compare multiple districts
router.post('/compare/districts', async (req, res) => {
  try {
    const { districtCodes, year } = req.body;
    
    if (!districtCodes || !Array.isArray(districtCodes)) {
      return res.status(400).json({ status: 'error', message: 'District codes array required' });
    }

    const query = { district_code: { $in: districtCodes } };
    if (year) {
      query.fin_year = new RegExp(`^${year}$`, 'i');
    }

    const comparison = await DistrictData.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$district_code',
          district_name: { $first: '$district_name' },
          state_name: { $first: '$state_name' },
          totalWorkers: { $sum: '$Total_No_of_Workers' },
          totalHouseholdsWorked: { $sum: '$Total_Households_Worked' },
          totalExpenditure: { $sum: '$Total_Exp' },
          avgWageRate: { $avg: '$Average_Wage_rate_per_day_per_person' },
          completedWorks: { $sum: '$Number_of_Completed_Works' },
          ongoingWorks: { $sum: '$Number_of_Ongoing_Works' }
        }
      }
    ]);

    res.json({ status: 'ok', comparison });
  } catch (err) {
    console.error('Error comparing districts:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get districts by state with summary data
router.get('/state/:stateName/districts', async (req, res) => {
  try {
    const { stateName } = req.params;
    const year = req.query.fin_year;

    const query = { state_name: new RegExp(`^${stateName}$`, 'i') };
    if (year) {
      query.fin_year = new RegExp(`^${year}$`, 'i');
    }

    const districts = await DistrictData.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$district_code',
          district_name: { $first: '$district_name' },
          district_code: { $first: '$district_code' },
          totalWorkers: { $sum: '$Total_No_of_Workers' },
          totalExpenditure: { $sum: '$Total_Exp' },
          totalHouseholdsWorked: { $sum: '$Total_Households_Worked' }
        }
      },
      { $sort: { district_name: 1 } }
    ]);

    res.json({ status: 'ok', districts });
  } catch (err) {
    console.error('Error fetching districts by state:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Geolocation endpoint: Find nearest district based on coordinates
router.get('/location/nearest', async (req, res) => {
  try {
    const { lat, lon, state } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ status: 'error', message: 'Latitude and longitude required' });
    }

    // This is a simplified version - in production, you'd have actual coordinates
    // For now, return districts from the state if provided
    const query = state ? { state_name: new RegExp(`^${state}$`, 'i') } : {};
    const districts = await DistrictData.distinct('district_name', query);
    
    res.json({ 
      status: 'ok', 
      message: 'Location-based search (simplified)',
      districts: districts.sort(),
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) }
    });
  } catch (err) {
    console.error('Error in location search:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
