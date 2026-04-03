import app from './app';
import { loadCSV } from './services/dbLoaderService';
import { calculateAndStoreBaselines } from './services/baselineMetricsService';

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    console.log('Initializing application context...');
    console.log('Loading CSV data into database...');
    await loadCSV();

    console.log('Calculating cohort baseline metrics...');
    calculateAndStoreBaselines();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
