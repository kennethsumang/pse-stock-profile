import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_utils/supabase/server";
import _ from "lodash";

/**
 * GET request handler for Transactions Summary
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const transactionsResponse = await client
    .from("company_transactions_summary")
    .select("*");

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
        statusText: "Failed getting transaction summary.",
      },
    );
  }

  return Response.json({
    data: transactionsResponse.data,
  });
}
