export interface Company {
  id: number;
  company_name: string;
  symbol: string;
  sector_name: string;
  subsector_name: string;
  listing_date: string;
  created_at: string;
}

export interface GetCompanyResponse {
  data: Company[];
  total: number;
}