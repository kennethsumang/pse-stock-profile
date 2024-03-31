import { Company } from "./companies";

export type TransactionType = 'buy'|'sell';

export interface Transaction {
  id: number;
  type: TransactionType;
  tax_amount: number;
  user_id: string; // uuid from auth table
  company_id: number; // id from company table
  quantity: number;
  price: number;
  created_at: string;
  transaction_timestamp: string;
  companies: {
    symbol: string;
    company_name: string;
  }
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
}

export interface TransactionForm {
  type: TransactionType;
  tax_amount: number;
  company: Company|null;
  quantity: number;
  price: number;
  transaction_timestamp: Date;
}