"use client"
import Image from 'next/image'
import axios, { AxiosError } from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { HOST } from '@/constant';

interface ProductCart {
  article: string;
  name: string;
  price: string;
  color:string;
  size:string
  id:string

}



export default function Cart() {
  const [user_id,setUser_id] = useState<string>('')
  const [Products,setProducts] = useState<ProductCart []>()
  const [ProductsStr,setProductsStr] = useState<string>()
  const [mail,set_mail] = useState<string>()
  const [flagState,setFlagState] = useState<string>()


  async function getProducts(user_id:string){
    const data = await fetch(`${HOST}/getProducts/${user_id}`)
    const res = await data.json()
    
    console.log(res);
    let arr: ProductCart[]  = []
    let t = ''
    let totalPrice = 0

    res && res.forEach((element: { [x: string]: any; }) => {
      const tmp:ProductCart = {
        name :element['product']['name'],
        article: element['product']['article'],
        price :element['product']['price'],
        color : element['product']['color'],
        size :element['size'],
        id :element['product']['id'],
      };
      arr.push(tmp)
      totalPrice+=Number(element['product']['price'])
      t+=element['product']['article']+' '+element['product']['price']+'\n'
    });

    t+=' totalPrice is'+totalPrice
    setProductsStr(t)
    setProducts(arr)
    console.log(Products,t);
    
    
    
  }

  const DelProduct = async (product_id: string,size:string) =>{
    console.log(product_id);
   
    const resp = await fetch(`${HOST}/DelFromcart`,
    {
      method:'POST',
      body:JSON.stringify({
        'product_id':product_id,
        'user_id':user_id,
        'size':size
      })
    })
    alert('Продукт удален')
    window.location.href='/cart'

  }

  useEffect(() => {
    (async () => {
      const user_id = await getUser();
      setUser_id(user_id)
      getProducts(user_id)

      const data2 = await fetch(`${HOST}/flag`)
      const res2 = await data2.json()

      res2 && setFlagState(res2['flag'])
    })();
  }, []);

  async function GetOrder(){
    if (mail!=undefined){
      const resp = await fetch(`${HOST}/send_mail`,{
        method:'POST',
        body:JSON.stringify({'text':ProductsStr,'email':mail})
      })
    
      let res  = await resp.json()
      Products?.forEach(element => {
        DelProduct(element.id,element.size)
      });
      console.log(res);
      window.location.href = '/catalog'
    }
  }
  if (flagState=='True')
  { return (
      <div className='flex flex-col ml-3.5 items-center'>
        <h1>Cart</h1>
        <h1>User id:{user_id}</h1>
        {Products && Products.map((p)=>(
          <div className='flex flex-row  border border-black p-2 m-3 w-1/4 items-end ' key={p.article+p.size}>
            <img width='70px'  src={`${HOST}/img/${p.article}`}  />
            <h2 className='ml-2'>{p.article}</h2>
            <h2 className='ml-2'>{p.name}</h2>
            <h2 className='ml-2'>{p.price}</h2>
            <h2 className='ml-2'>{p.size}</h2>
            <h2 className='ml-2'>{p.id}</h2>
            <button className=' border border-black p-1 ml-4'  onClick={(event: React.MouseEvent<HTMLButtonElement>) => DelProduct(p.id,p.size)}>Delete</button>
          </div>
        ))}
      <div className='flex flex-col'>
        <button className='border border-black mb-4' onClick={GetOrder} >Купить</button>
        <input type="text" placeholder='email' onChange={(e)=>set_mail(e.target.value)}/>
      </div>
      </div>
    )}else{
      return (
        <div className='flex flex-col ml-3.5 items-center'>
          <h1>Cart</h1>
          <h1>User id:{user_id}</h1>
          {Products && Products.map((p)=>(
            <div className='flex flex-row  border border-black p-2 m-3 w-1/4 items-end ' key={p.article+p.size}>
              <img width='70px'  src={`${HOST}/img/${p.article}`}  />
              <h2 className='ml-2'>{p.article}</h2>
              <h2 className='ml-2'>{p.name}</h2>
              <h2 className='ml-2'>{p.price}</h2>
              <h2 className='ml-2'>{p.size}</h2>
              <h2 className='ml-2'>{p.id}</h2>
              <button className=' border border-black p-1 ml-4'  onClick={(event: React.MouseEvent<HTMLButtonElement>) => DelProduct(p.id,p.size)}>Delete</button>
            </div>
          ))}
        <div className='flex flex-col'>
          <h1>Оплата невозможна Админ спит!!!!!!!!!!!</h1>
        </div>
        </div>
      )
    }
}



async function getUser(){
    const { data } = await axios.get("/api/me");
    console.log('data',data['user_id']);
    
    return data['user_id']
}



    
  