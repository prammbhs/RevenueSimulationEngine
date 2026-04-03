import { Router } from 'express';
import { postSimulatedQ3Performance } from '../controllers/performanceController';
import { validateRequest } from '../middlewares/validateMiddleware';
import { SimulationPayloadSchema } from '../validators/simulationSchema';

const router = Router();

router.post('/simulated', validateRequest(SimulationPayloadSchema), postSimulatedQ3Performance);

export default router;
