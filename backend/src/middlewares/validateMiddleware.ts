import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Bad Request',
          details: error.issues.map((m: any) => ({ path: m.path.join('.'), message: m.message }))
        });
      } else {
        res.status(500).json({ error: 'Internal Server Error during validation' });
      }
    }
  };
};
