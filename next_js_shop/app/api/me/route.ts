import { COOKIE_NAME } from "../../../constant/index";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }else{
    const response = {
      user_id: token['value'],
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }

  // const { value } = token;

  // Always check this
  // const secret = "asjaskldjaksdjakjk23l23j4klj";

  // try {
  //   // verify(value, secret);

  //   const response = {
  //     user: "Super Top Secret User",
  //   };

  //   return new Response(JSON.stringify(response), {
  //     status: 200,
  //   });
  // } catch (e) {
  //   return NextResponse.json(
  //     {
  //       message: "Something went wrong",
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }
}