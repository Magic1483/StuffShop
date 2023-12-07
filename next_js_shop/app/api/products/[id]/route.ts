import { NextResponse } from "next/server"
import { HOST } from "@/constant";

type Props = {
    params:{
        id:string
    }
}

export async  function GET(req:Request,context:Props){
    console.log(context.params.id);
    
    let data = await fetch(`${HOST}/items/${context.params.id}`)
    let res = await data.json()
    return NextResponse.json(res)
}
