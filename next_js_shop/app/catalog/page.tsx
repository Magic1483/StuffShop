'use client'
import Image from 'next/image'
import type {  GetStaticProps } from 'next'
import { useState,useEffect } from 'react'
import { HOST } from '@/constant'

interface Product {
  id: number;
  article: string;
  name: string;
  price: string;
  imgs:string;
}


export default  function Catalog(){
  const [products,setProducts] = useState<Product[]>([])

  useEffect(()=>{
    const  getData= async () => {
      const data = await fetch('/api/products')
      const res = await data.json()


      res && setProducts(res)
    }
    getData()
    
  },[])

  
  

  return (
      <div className='flex flex-wrap justify-evenly border-0 overflow-hidden'>
        {products && products.map((product)=>(
          <a href={`/catalog/${product.id}`} key={product.id}>
          <div className='mb-6 border border-black p-4' id={product.article}>
            <div className='m-auto'>
              <img width='400px'  src={`${HOST}/img/${product.article}`}  />
            </div>
            <h2>{product.name}</h2>
            <h3>{product.price}</h3>
            <h3>{product.id}</h3>
          </div>
          </a>
        ))}
      </div>
      
  )
}
