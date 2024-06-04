import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError, number, object } from "yup";

/**
 * PUT request handler
 * @author Kenneth Sumang
 */
export async function PUT(request: NextRequest, { params }: { params: { dividendId: string } }) {
    const client = createClient();
    const body = await request.json();
    const dividendId = params.dividendId;
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
          statusText: "Unauthorized.",
        },
      );
    }

    if (!dividendId) {
      return Response.json(
        {
          error: {
            code: 400,
            message: 'Dividend ID is missing.',
          },
        },
        {
          status: 400,
          statusText: "Some of the data is invalid.",
        },
      );
    }
  
    try {
      const validated = await validationSchema.validate(body, { strict: true });
      const updateResponse = await client
        .from("dividends")
        .update({ ...validated, user_id: loggedInUserResponse.data.user.id })
        .eq('id', dividendId)
        .select();
  
      if (updateResponse.error) {
        return Response.json(
          {
            error: {
              code: 500,
              message: updateResponse.error.message,
            },
          },
          {
            status: 500,
            statusText: "Failed updating the dividend record.",
          },
        );
      }
  
      return Response.json({ data: updateResponse.data });
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