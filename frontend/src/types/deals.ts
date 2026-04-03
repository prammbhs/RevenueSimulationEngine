/** DealRecord shape from GET /api/v1/deals */
export interface DealRecord {
  deal_id:        string;
  created_date:   string;
  closed_date:    string | null;
  stage:          string;
  deal_value:     number;
  region:         string;
  source:         string;
  quarter:        string;
  price_category: 'small' | 'medium' | 'large';
}

export interface DealsResponse {
  status: string;
  count:  number;
  data:   DealRecord[];
}
