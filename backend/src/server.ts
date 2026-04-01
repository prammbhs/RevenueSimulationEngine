import app from './app';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // TODO: 1. Parse deals.csv on startup and load them.
    // TODO: 2. Calculate "Cohort Baseline" logic here.
    console.log('Initializing application context...');

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
