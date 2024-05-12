import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_utils/supabase/server";
import _ from "lodash";

/**
 * GET request handler for Transactions Year-on-Year
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const transactionsResponse = await client
    .from("transaction_by_type_yoy")
    .select("*")
    .order("year", { ascending: true });

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
        statusText: "Failed getting YoY transactions.",
      },
    );
  }

  // format year
  const data = _.map(
    transactionsResponse.data,
    (yoyData: { year: string; buy_total: number, sell_total: number }) => {
      return {
        ...yoyData,
        year: yoyData.year.slice(0, 4),
      };
    },
  );
  return Response.json({
    data,
  });
}
