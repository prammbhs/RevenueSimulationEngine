import { Router } from 'express';
import { getAllDeals } from '../controllers/dealsController';

const router = Router();

router.get('/', getAllDeals);

export default router;
