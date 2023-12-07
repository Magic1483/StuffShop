"use client"
import Image from 'next/image'
import { SetStateAction, useState } from 'react'


export default function About() {
    const [login,setLogin] = useState<string>('')
    const [password,setPassword] = useState<string>('')

    const CheckLogin = async () =>{
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                'login':login,
                'password':password
            })
        })

        
        
        let res  = await response.json()
        console.log(res);
        
        if(res['message']=='Authenticated!'){
            console.log('User found');
            window.location.href="/catalog";
        }
        else{
            console.log('Not fount');
            
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
        <input type="password" placeholder='password'  className='mb-3 border-black border p-1' onChange={PasswordHandler}/>
        <button className='border-black border p-1' onClick={CheckLogin}>LogIn</button>
        <a href="/register"><h4>Register</h4></a>
        </div>
    </div>
  )
}
