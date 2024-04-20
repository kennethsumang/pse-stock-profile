import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_utils/supabase/server";
import _ from "lodash";

/**
 * GET request handler for Dividend Year-on-Year
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const dividendsResponse = await client.from("dividends_yoy").select("*");

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

  // format year
  const data = _.map(
    dividendsResponse.data,
    (yoyData: { year: string; total_amt: number }) => {
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
