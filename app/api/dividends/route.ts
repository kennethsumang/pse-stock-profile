import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
// import { ValidationError, number, object, string } from "yup";
import { DateTime } from "luxon";

/**
 * GET request handler
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const symbol = searchParams.get("symbol");
  const dateFrom = searchParams.get("date-from");
  const dateTo = searchParams.get("date-to");

  const offsetFrom = (page - 1) * limit;
  const offsetTo = offsetFrom + limit - 1;

  const loggedInUserResponse = await client.auth.getUser();

  if (loggedInUserResponse.error) {
    return Response.json(
      {
        error: {
          code: 401,
          message: loggedInUserResponse.error.message,
        },
      },
      {
        status: 401,
        statusText: "Failed fetching of records.",
      },
    );
  }

  let query = client
    .from("dividends")
    .select("*,companies!inner(symbol,company_name)", { count: "exact" })
    .eq("user_id", loggedInUserResponse.data.user.id);

  if (symbol) {
    query = query.eq("companies.symbol", symbol);
  }

  if (dateFrom && dateTo) {
    // validate dates
    const dateFromObject = DateTime.fromISO(dateFrom);
    const dateToObject = DateTime.fromISO(dateTo);
    if (!dateFromObject.isValid || !dateToObject.isValid) {
      return Response.json(
        {
          error: {
            code: 400,
            message: "Invalid date params.",
          },
        },
        {
          status: 400,
          statusText: "Failed fetching of records.",
        },
      );
    }

    const utcDateFrom = dateFromObject.setZone("utc").toISO();
    const utcDateTo = dateToObject.setZone("utc").toISO();

    query = query
      .gte("dividend_timestamp", utcDateFrom)
      .lte("dividend_timestamp", utcDateTo);
  }

  const recordsResponse = await query
    .order("dividend_timestamp", { ascending: false })
    .range(offsetFrom, offsetTo);
  if (recordsResponse.error) {
    return Response.json(
      {
        error: {
          code: 500,
          message: recordsResponse.error.message,
        },
      },
      {
        status: 401,
        statusText: "Failed fetching of records.",
      },
    );
  }

  return Response.json({
    data: recordsResponse.data,
    total: recordsResponse.count,
  });
}
