import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError, number, object, string } from "yup";

/**
 * GET request handler
 * @author Kenneth Sumang
 */
export async function GET(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offsetFrom = (page - 1) * limit;
  const offsetTo = offsetFrom + limit - 1;

  const loggedInUserResponse = await client.auth.getUser();

  if (loggedInUserResponse.error) {
    return Response
      .json({
        error: {
          code: 401,
          message: loggedInUserResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed fetching of records.'
      });
  }

  const recordsResponse = await client.from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", loggedInUserResponse.data.user.id)
    .order("id", { ascending: true })
    .range(offsetFrom, offsetTo);
  
  if (recordsResponse.error) {
    return Response
      .json({
        error: {
          code: 500,
          message: recordsResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed fetching of records.'
      });
  }

  return Response.json(
    { 
      data: recordsResponse.data,
      total: recordsResponse.count,
    },
  );
}

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();
  const validationSchema = object({
    company_id: number().required(),
    type: string().oneOf(["buy", "sell"]).required(),
    price: number().required(),
    quantity: number().required(),
    tax_amount: number().required(),
  });

  const loggedInUserResponse = await client.auth.getUser();
  if (loggedInUserResponse.error) {
    return Response
      .json({
        error: {
          code: 401,
          message: loggedInUserResponse.error.message
        },
      }, {
        status: 401,
        statusText: 'Failed creating new transaction.'
      });
  }

  try {
    const validated = await validationSchema.validate(body, { strict: true });
    const insertResponse = await client
      .from("transactions")
      .insert({ ...validated, user_id: loggedInUserResponse.data.user.id });
    
    if (insertResponse.error) {
      return Response
        .json({
          error: {
            code: 500,
            message: insertResponse.error.message
          },
        }, {
          status: 500,
          statusText: 'Failed creating new transaction.'
        });
    }

    return Response.json(
      { data: insertResponse.data },
    );
  } catch (e) {
    if (e instanceof ValidationError) {
      return Response
        .json({
          error: {
            code: 400,
            message: (e as ValidationError).errors[0]
          },
        }, {
          status: 400,
          statusText: 'Some of the data is invalid.'
        });
    }
      
    return Response
      .json({
        error: {
          code: 500,
          message: (e as Error).message
        },
      }, {
        status: 400,
        statusText: 'An unexpected error has occurred.'
      });
  }
}