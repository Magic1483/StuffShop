import { NextRequest, NextResponse } from "next/server"
import { HOST } from "@/constant";

export async  function POST(req:NextRequest){
    let data = await fetch(`${HOST}/upload`,{
        method:'POST',
    })
    let res = await data.json()
    console.log(res);

    return NextResponse.json(res)
}

