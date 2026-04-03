import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import dealsRoutes from './routes/dealsRoutes';
import metricsRoutes from './routes/metricsRoutes';
import performanceRoutes from './routes/performanceRoutes';

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Simulation Engine is running' });
});

// API Routes
app.use('/api/v1/deals', dealsRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/performances', performanceRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
