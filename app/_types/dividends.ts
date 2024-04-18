import { Company } from "./companies";

export interface Dividend {
  id: number;
  user_id: string; // uuid
  company_id: number; // id
  no_of_shares: number;
  amount_per_share: number;
  tax_amount: number;
  created_at: string;
  dividend_timestamp: string;
  companies: {
    symbol: string;
    company_name: string;
  };
}

export interface DividendResponse {
  data: Dividend[];
  total: number;
}

export interface DividendForm {
  tax_amount: number;
  company: Company | null;
  no_of_shares: number;
  amount_per_share: number;
  dividend_timestamp: Date;
}
