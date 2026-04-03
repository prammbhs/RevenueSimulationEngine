import { Request, Response } from 'express';
import * as dealsRepository from '../repository/dealsRepository';

export const getAllDeals = (req: Request, res: Response) => {
  try {
    const deals = dealsRepository.getAllDeals();
    res.status(200).json({
      status: 'success',
      count: deals.length,
      data: deals
    });
  } catch (error) {
    console.error('Error fetching all deals:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch the deals.'
    });
  }
};
