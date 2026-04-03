import { z } from 'zod';

export const SimulationPayloadSchema = z.object({
  conversionChange: z.number().finite().min(-1).max(1).default(0).optional(),
  dealSizeChange: z.number().finite().min(-1).max(5).default(0).optional(),
  cycleChange: z.number().finite().default(0).optional(),
});
