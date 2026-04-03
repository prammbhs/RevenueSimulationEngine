import Database from 'better-sqlite3';
import path from 'path';
import { DealRecord } from '../types';

const dbPath = path.join(__dirname, '../data/sqlite.db');
const db = new Database(dbPath);

/**
 * Helper Method to fetch deals by quarter.
 * Used by the Simulation Engine to easily fetch Q3 data.
 */
export const getDealsByQuarter = (quarter: string): DealRecord[] => {
  const stmt = db.prepare('SELECT * FROM deals WHERE quarter = ?');
  return stmt.all(quarter) as DealRecord[];
};

/**
 * Fetches all deals from the database.
 */
export const getAllDeals = (): DealRecord[] => {
  const stmt = db.prepare('SELECT * FROM deals');
  return stmt.all() as DealRecord[];
};
