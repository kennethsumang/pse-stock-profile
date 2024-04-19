import { createClient } from "@/app/_utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError, number, object, string } from "yup";

/**
 * POST request handler
 * @author Kenneth Sumang
 */
export async function POST(request: NextRequest, response: NextResponse) {
  const client = createClient();
  const body = await request.json();

  const validationSchema = object({
    first_name: string().min(2).max(20).required(),
    last_name: string().min(2).max(20).required(),
    email: string().email().required(),
    password: string().min(5).required(),
  });

  try {
    const validated = await validationSchema.validate(body, { strict: true });
    const registerResponse = await client.auth.signUp({
      email: validated.email,
      password: validated.password,
    });

    if (registerResponse.error) {
      return Response.json(
        {
          error: {
            code: 500,
            message: registerResponse.error.message,
          },
        },
        {
          status: 500,
          statusText: "Failed user registration.",
        },
      );
    }

    // create new user profile
    const userId = registerResponse.data.user!.id;
    const userProfileResponse = await client.from("user_profiles").insert({
      user_id: userId,
      first_name: validated.first_name,
      last_name: validated.last_name,
    });

    if (userProfileResponse.error) {
      return Response.json(
        {
          error: {
            code: 500,
            message: userProfileResponse.error.message,
          },
        },
        {
          status: 500,
          statusText: "Failed user profile creation.",
        },
      );
    }

    return Response.json({ data: userProfileResponse.data });
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
