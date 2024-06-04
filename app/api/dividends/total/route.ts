import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_utils/supabase/server";
import _ from "lodash";

/**
 * GET request handler for Total Dividends
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const dividendsResponse = await client
    .from("total_dividends")
    .select("*")
    .single();

  if (dividendsResponse.error) {
    return Response.json(
      {
        error: {
          code: 401,
          message: dividendsResponse.error.message,
        },
      },
      {
        status: 401,
        statusText: "Failed getting YoY dividends.",
      },
    );
  }

  return Response.json({
    data: dividendsResponse.data.sum || 0,
  });
}
