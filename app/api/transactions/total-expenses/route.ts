import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_utils/supabase/server";
import _ from "lodash";

/**
 * GET request handler for Total Expenses for Transactions
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const transactionsResponse = await client
    .from("transactions_total_expenses")
    .select("*")
    .single();

  if (transactionsResponse.error) {
    return Response.json(
      {
        error: {
          code: 401,
          message: transactionsResponse.error.message,
        },
      },
      {
        status: 401,
        statusText: "Failed getting YoY dividends.",
      },
    );
  }

  return Response.json({
    data: transactionsResponse.data.difference || 0,
  });
}
