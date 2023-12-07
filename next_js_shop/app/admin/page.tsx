"use client"
import Image from 'next/image'
import { useState,useEffect } from 'react'
import path from 'path';
import { HOST } from '@/constant';



interface Product {
    id: number;
    article: string;
    name: string;
    price: string;
    imgs:string;
  }


export default function Admin() {
    const [images, setImages] = useState<File[]>([])
    // const [article, setArticle] = useState<string>('')
    const [name, setName] = useState<string>('')
    // const [color, setColor] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [checked_sizes,setChecked_sizes] = useState<string[]>([])
    const sizes = ['S','X','XL','L']
    const [products,setProducts] = useState<Product[]>([])
    const [flagState,setFlagState] = useState<string>()

    useEffect(()=>{
        const  getData= async () => {
        const data = await fetch('/api/products')
        const res = await data.json()

        const data2 = await fetch(`${HOST}/flag`)
        const res2 = await data2.json()

        res && setProducts(res)
        res2 && setFlagState(res2['flag'])
        }
        getData()
        
    },[])

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setImages(files)
    }

    const changeFlag = async () => {
        const data = await fetch(`${HOST}/change_flag`)
        window.location.href = '/admin'
    }

    const handleSize = async(event: React.ChangeEvent<HTMLInputElement>)=>{
        if (event.target.checked){
            let arr = checked_sizes
            arr.push(event.target.id)
            setChecked_sizes(arr)
            
            console.log('add',event.target.id);
            console.log(checked_sizes);
        }else{
            const index = checked_sizes.indexOf(event.target.id)
            setChecked_sizes(checked_sizes.slice(0, index).concat(checked_sizes.slice(index +  1)))
            console.log('delete',event.target.id);
            console.log(checked_sizes);

            
        }
        
    }

    const Submit = async()=>{
        
        //Send imgs
        const formData = new FormData()
        images.forEach((file) => {
        formData.append('images', file)
        })

        const response = await fetch(`${HOST}/upload_imgs`, {
        method: 'POST',
        body: formData
        })

        if (response.ok) {
        console.log('Images uploaded successfully')
        } else {
        console.error('Failed to upload images')
        }

        let filename = images[0].name
        
        let s =filename.split('_')
        s.pop()
        let article = ""
        s.forEach((el)=>{
        article+=el+'_'
        })
        let color =s.pop()
        article =article.substring(0, article.length - 1)

        console.log(article,color);
        
        checked_sizes.forEach(element => {
            console.log(element);
        });
        const product_response = await fetch(`${HOST}/upload`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({
                'article':article,
                'name':name,
                'color':color,
                'price':price,
                'sizes':checked_sizes
            })
        })
        
        alert('Добавлен продукт  '+article)
        window.location.href = '/admin'

    }

    const DelById = async(id:number)=>{
        const response = await fetch(`${HOST}/del_product`, {
        method: 'POST',
        body: JSON.stringify({'product_id':id})
        })

        alert('Удален продукт  ')
        window.location.href = '/admin'
    }

  return (
    <div className='flex  flex-col content-center flex-wrap h-screen'>
        <div>Admin page</div>
        <h2>Flag state is {flagState}</h2>
        <button className='border border-black' onClick={changeFlag}>change flag</button>
        <div className='flex  flex-col w-1/5 mt-10 h-60 justify-between'>
            <h1>Add product</h1>
            {/* <input type="text" placeholder='article' onChange={(e)=>setArticle(e.target.value)}></input> */}
            <input type="text" placeholder='name' onChange={(e)=>setName(e.target.value)}></input>
            {/* <input type="text" placeholder='color' onChange={(e)=>setColor(e.target.value)}></input> */}
            <input type="text" placeholder='price' onChange={(e)=>setPrice(e.target.value)}></input>
            <div className='flex flex-row justify-between'>
            {sizes.map((el)=>(
                <div key={el}>
                    <label htmlFor={el}>{el}</label>
                    <input type='checkbox' id={el} className='ml-2' onChange={handleSize}></input>
                </div>
            ))}
            </div>
            
            <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleImageUpload} />
            <button type='submit' onClick={Submit} className='bg-gray-500'>Add Product</button>
        </div>

        <div className='mt-8'>
            {products && products.map((p)=>(
                <div className='flex flex-row justify-between mt-2' key={p.article}>
                    <a href={`/admin/${p.id}`}><h3>{p.article}</h3></a>
                    <h3>{p.name}</h3>
                    <h3>{p.price}   RUB</h3>
                    <button className='border-black border p-1' onClick={(event: React.MouseEvent<HTMLButtonElement>) => DelById(p.id)}>Delete</button>
                </div>
            ))}
        </div>
    </div>
  )
}
