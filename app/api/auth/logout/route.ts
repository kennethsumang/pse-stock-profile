import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();

  const signOutResponse = await client.auth.signOut();

  if (signOutResponse.error) {
    return Response
      .json({
        error: {
          code: 401,
          message: signOutResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed login.'
      });
  }

  return Response.json({ data: "OK" });
}