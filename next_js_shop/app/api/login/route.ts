import { COOKIE_NAME } from "../../../constant/index";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { HOST } from "../../../constant/index";

const MAX_AGE = 60 * 60 * 24 * 30; // days;

export async function POST(request: Request) {
  const body = await request.json();

  const { login, password } = body;
  console.log(login,password);
  

  const resp = await fetch(`${HOST}/login`,{
    method:'POST',
    body:JSON.stringify({'login':login,'password':password})
  })

  let res  = await resp.json()
  console.log(res);
  

  if (res['user_id']==null) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  // Always check this
  // const secret = "asjaskldjaksdjakjk23l23j4klj";

  // const token = sign(
  //   {
  //     login,
  //   },
  //   secret,
  //   {
  //     expiresIn: MAX_AGE,
  //   }
  // );

  // let token =1;

  const seralized = serialize(COOKIE_NAME, String(res['user_id']), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const response = {
    message: "Authenticated!",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": seralized },
  });
}