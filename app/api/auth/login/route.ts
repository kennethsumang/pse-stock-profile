import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();

  const signInResponse = await client.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });

  if (signInResponse.error) {
    return Response
      .json({
        error: {
          code: 401,
          message: signInResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed login.'
      });
  }

  const userProfileResponse = await client
    .from('user_profiles')
    .select(`id,user_id,first_name,last_name`)
    .eq('user_id', signInResponse.data.user.id)
    .single();

  if (userProfileResponse.error) {
    return Response
      .json({
        error: {
          code: 404,
          message: userProfileResponse.error.message
        },
      }, {
        status: 405,
        statusText: 'User profile not found.'
      });
  }

  return Response.json(
    { 
      data: {
        ...userProfileResponse.data,
        email: signInResponse.data.user.email,
        role: signInResponse.data.user.role
      }
    },
  );
}