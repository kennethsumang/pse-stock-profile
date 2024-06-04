import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError, array, number, object, string } from "yup";
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

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();
  const validationSchema = object({
    company_id: number().required(),
    amount_per_share: number().required(),
    no_of_shares: number().required(),
    tax_amount: number().required(),
  });

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
        statusText: "Failed creating new transaction.",
      },
    );
  }

  try {
    const validated = await validationSchema.validate(body, { strict: true });
    const insertResponse = await client
      .from("dividends")
      .insert({ ...validated, user_id: loggedInUserResponse.data.user.id });

    if (insertResponse.error) {
      return Response.json(
        {
          error: {
            code: 500,
            message: insertResponse.error.message,
          },
        },
        {
          status: 500,
          statusText: "Failed creating new dividend record.",
        },
      );
    }

    return Response.json({ data: insertResponse.data });
  } catch (e) {
    if (e instanceof ValidationError) {
      return Response.json(
        {
          error: {
            code: 400,
            message: (e as ValidationError).errors[0],
          },
        },
        {
          status: 400,
          statusText: "Some of the data is invalid.",
        },
      );
    }

    return Response.json(
      {
        error: {
          code: 500,
          message: (e as Error).message,
        },
      },
      {
        status: 400,
        statusText: "An unexpected error has occurred.",
      },
    );
  }
}

/**
 * DELETE request handler
 * @author Kenneth Sumang
 */
export async function DELETE(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();
  const validationSchema = object({
    dividend_ids: array().of(number()),
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
        statusText: 'Unauthorized.'
      });
  }

  try {
    const validated = await validationSchema.validate(body, { strict: true });
    const deletedResponse = await client
      .from('dividends')
      .delete()
      .in('id', validated.dividend_ids as number[])
      .select();
    
    if (deletedResponse.error) {
      return Response
        .json({
          error: {
            code: 500,
            message: deletedResponse.error.message
          },
        }, {
          status: 500,
          statusText: 'Failed deleting dividend records.'
        });
    }

    return Response.json(
      { data: deletedResponse.data },
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