import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import Database from 'better-sqlite3';

const dbPath = path.join(__dirname, '../data/sqlite.db');
const csvPath = path.join(__dirname, '../data/deals.csv');

// Initialize the database
const db = new Database(dbPath);

export interface DealRecord {
  deal_id: string;
  created_date: string;
  closed_date: string | null;
  stage: string;
  deal_value: number;
  region: string;
  source: string;
  quarter: string;
  price_category: string;
}

//Ensures the deals table exists in the database.
const initializeSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
      deal_id TEXT PRIMARY KEY,
      created_date TEXT,
      closed_date TEXT,
      stage TEXT,
      deal_value INTEGER,
      region TEXT,
      source TEXT,
      quarter TEXT,
      price_category TEXT
    )
  `);
};

export const loadCSV = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      initializeSchema();
      const countRow = db.prepare('SELECT COUNT(*) as count FROM deals').get() as { count: number };
      if (countRow.count > 0) {
        console.log(`Database already populated with ${countRow.count} deals. Skipping CSV load.`);
        return resolve();
      }

      const dealsToInsert: DealRecord[] = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          // Date Conversion & Quarter Assignment
          // Data is expected in "YYYY-MM-DD" format.
          let quarter = 'Unknown';
          const match = data.created_date.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (match) {
            const month = parseInt(match[2], 10);
            if (month >= 1 && month <= 3) quarter = 'Q1';
            else if (month >= 4 && month <= 6) quarter = 'Q2';
            else if (month >= 7 && month <= 9) quarter = 'Q3';
            else quarter = 'Q4';
          }

          // Price Categorization
          const dealValue = parseInt(data.deal_value, 10);
          let priceCategory = 'Unknown';
          if (dealValue < 10000) {
            priceCategory = 'small';
          } else if (dealValue <= 30000) {
            priceCategory = 'medium';
          } else {
            priceCategory = 'large';
          }

          dealsToInsert.push({
            deal_id: data.deal_id,
            created_date: data.created_date,
            closed_date: data.closed_date ? data.closed_date : null,
            stage: data.stage,
            deal_value: dealValue,
            region: data.region,
            source: data.source,
            quarter,
            price_category: priceCategory,
          });
        })
        .on('end', () => {
          const insertStmt = db.prepare(`
            INSERT INTO deals (
              deal_id, created_date, closed_date, stage, deal_value, region, source, quarter, price_category
            ) VALUES (
              @deal_id, @created_date, @closed_date, @stage, @deal_value, @region, @source, @quarter, @price_category
            )
          `);

          const insertMany = db.transaction((deals: DealRecord[]) => {
            for (const deal of deals) {
              insertStmt.run(deal);
            }
          });

          try {
            insertMany(dealsToInsert);
            console.log(`Successfully loaded ${dealsToInsert.length} deals into the database.`);
            resolve();
          } catch (err) {
            console.error('Error inserting deals during transaction:', err);
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV file:', err);
          reject(err);
        });
    } catch (err) {
      console.error('Error initializing schema or querying DB:', err);
      reject(err);
    }
  });
};
