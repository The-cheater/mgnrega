import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for ES Modules
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictData from '../src/models/DistrictData.js'; // ES Module import

// Load .env variables
dotenv.config();

// --- CONFIGURE THIS ---
const MONGO_URI = process.env.MONGO_URI; // Get URI from .env

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE_PATH = path.join(__dirname, 'merged_data.csv'); // Assumes CSV is in 'scripts' folder
// --------------------

// Helper function to clean and convert numbers
const parseNumbers = (value) => {
  // Ultra-safe parser:
  if (!value || value === 'N/A') return 0; // Handle null, undefined, N/A
  const stringValue = String(value).trim(); // Convert to string AND trim
  if (stringValue === '') return 0; // Handle empty strings
  
  const cleanedValue = stringValue.replace(/,/g, ''); // Removes commas
  return parseFloat(cleanedValue) || 0;
};

// Helper function to map headers
const mapHeader = (header) => {
  // --- THIS IS THE FIX ---
  // If the header is blank (null or undefined), return an empty string
  // Otherwise, trim it.
  return header ? header.trim() : ''; 
};

async function seedDatabase() {
  const results = [];

  if (!MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }

  console.log(`Starting to read CSV file: ${CSV_FILE_PATH}`);

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv({
      mapHeaders: ({ header }) => mapHeader(header),
      mapValues: ({ header, value }) => {
        // List of all headers that should be numbers
        const numberFields = [
          'Approved_Labour_Budget', 'Average_Wage_rate_per_day_per_person',
          'Average_days_of_employment_provided_per_Household', 'Differently_abled_persons_worked',
          'Material_and_skilled_Wages', 'Number_of_Completed_Works', 'Number_of_GPs_with_NIL_exp',
          'Number_of_Ongoing_Works', 'Persondays_of_Central_Liability_so_far', 'SC_persondays',
          'SC_workers_against_active_workers', 'ST_persondays', 'ST_workers_against_active_workers',
          'Total_Adm_Expenditure', 'Total_Exp', 'Total_Households_Worked', 'Total_Individuals_Worked',
          'Total_No_of_Active_Job_Cards', 'Total_No_of_Active_Workers', 'Total_No_of_HHs_completed_100_Days_of_Wage_Employment',
          'Total_No_of_JobCards_issued', 'Total_No_of_Workers', 'Total_No_of_Works_Takenup',
          'Wages', 'Women_Persondays', 'percent_of_Category_B_Works', 'percent_of_Expenditure_on_Agriculture_Allied_Works',
          'percent_of_NRM_Expenditure', 'percentage_payments_gererated_within_15_days'
        ];

        // We already trimmed the header in mapHeader, but we trim here
        // again just in case.
        const trimmedHeader = header ? header.trim() : '';
        
        if (numberFields.includes(trimmedHeader)) {
          return parseNumbers(value); // Use our new safe number parser
        }

        // If the value is undefined or null, return an empty string.
        // Otherwise, trim it.
        return value ? value.trim() : '';
      }
    }))
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      console.log(`Finished reading CSV. Found ${results.length} records.`);
      
      if (results.length === 0) {
        console.log('No data to insert. Check CSV file and headers.');
        await mongoose.disconnect();
        return;
      }

      try {
        console.log('Clearing existing data from collection...');
        await DistrictData.deleteMany({});

        console.log('Inserting new data...');
        await DistrictData.insertMany(results);
        
        console.log('Successfully seeded database!');
      } catch (err)
      {
        console.error('Error seeding database:', err);
      } finally {
        // Close the database connection
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
      }
    });
}

// Run the function
seedDatabase();

