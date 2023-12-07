import { COOKIE_NAME } from "../../../constant/index";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  try{
    cookieStore.delete(COOKIE_NAME)
    return new Response(JSON.stringify({'status':'Not Authorised'}), {
        status: 200,
      });
    
  }catch{
    return new Response(JSON.stringify({'status':'Not Authorised'}), {
        status: 200,
      });
  }

}