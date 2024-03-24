import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const searchParams = request.nextUrl.searchParams;
  const searchValue = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offsetFrom = (page - 1) * limit;
  const offsetTo = offsetFrom + limit - 1;

  const companyRequest = client.from('companies');
  let companyResponse = null;

  if (searchValue) {
    companyResponse = await companyRequest
      .select("*", { count: "exact" })
      .or(`company_name.ilike.%${searchValue}%,symbol.ilike.%${searchValue}%`)
      .order("id", { ascending: true })
      .range(offsetFrom, offsetTo);
  } else {
    companyResponse = await companyRequest
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(offsetFrom, offsetTo);
  }

  return Response.json(
    { 
      data: companyResponse.data,
      total: companyResponse.count,
    },
  );
}
