export interface Transaction {
  id: number;
  type: 'buy' | 'sell';
  tax_amount: number;
  user_id: string; // uuid from auth table
  company_id: number; // id from company table
  quantity: number;
  price: number;
  created_at: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
}