"use client"
import Image from 'next/image'
import { SetStateAction, useState } from 'react'
import { HOST } from '@/constant'

export default function About() {
    const [login,setLogin] = useState<string>('')
    const [password,setPassword] = useState<string>('')

    const CheckLogin = async () =>{

        if (login!='' && password!=''){
        const response = await fetch(`${HOST}/register`, {
            method: 'POST',
            body: JSON.stringify({
                'login':login,
                'password':password
            })
        })

        window.location.href="/login";
    }

        

    }

    const LoginHandler = async (event: { target: { value: SetStateAction<string> } })=>{
        setLogin(event.target.value)
    }

    const PasswordHandler = async (event: { target: { value: SetStateAction<string> } })=>{
        setPassword(event.target.value)
    }

  return (
    <div className='flex align-center '>
        <div className='flex m-auto flex-col w-40 mt-8 mb-8'>
        <input type="text" placeholder='login' className='mb-3 border-black border p-1' onChange={LoginHandler}/>
        <input type="password" placeholder='password' className='mb-3 border-black border p-1' onChange={PasswordHandler}/>
        <button className='border-black border p-1' onClick={CheckLogin}>Register</button>
        </div>
    </div>
  )
}
