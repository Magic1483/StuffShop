import { NextResponse } from "next/server"
import { HOST } from "@/constant";

export async  function GET(req:Request){
    let data = await fetch(`${HOST}/items`)
    let res = await data.json()
    console.log(res);

    return NextResponse.json(res)
}
