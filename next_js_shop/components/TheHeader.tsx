"use client"
import Link from "next/link";
import {signIn,signOut} from "next-auth/react"
import { COOKIE_NAME } from "../constant/index";
import { cookies } from "next/headers";

const TheHeader = () =>{

    const LogOut = async () => {
        const resp = fetch('/api/logout')
    }

    

    return (
        
        <header className="h-20 flex justify-evenly items-center ">
            <Link href='/' className="link">Home</Link>
            <Link href='/catalog' className="link">Catalog</Link>
            <Link href='/cart' className="link">Cart</Link>
            <Link href='/login' className="link">LogIn</Link>
            <Link href='#' className="link" onClick={LogOut}>LogOut</Link>
            
        </header>
    )
}

export {TheHeader};