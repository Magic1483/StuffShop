"use client"
import { SetStateAction, useEffect,useState,FC } from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { HOST } from '@/constant';

type Props = {
    params:{
        id:string
    }
}

interface Product {
    id: number;
    article: string;
    name: string;
    price: string;
    brand:string;
    color_name:string;
    category:string;
    color:number;
  }



interface Dictionary {
    [key: string]: boolean;
  }




export default function EditProduct({params:{id}}:Props){
    const [product, setProduct] = useState<Product>()
    const [images,setImages] = useState<string[]>([])
    const [checked_sizes,setChecked_sizes] = useState<string[]>([])

    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')



    
    const all_sizes = ['S','X','XL','L']
    

    useEffect(()=>{
        const  getData= async () => {
          const data = await fetch(`${HOST}/items/${id}`)
          const res = await data.json()
    
            
          console.log(res['product']);
          res && setProduct(res['product'])
        
          
          
          


          
          
          const img_data = await fetch(`${HOST}/img_list/${res['product']['article']}`)
          const imgs = await img_data.json()
          console.log(imgs);
          imgs && setImages(imgs)
            
          
        }
        getData();
        console.log(all_sizes);
        
      },[])

      const Submit = async()=>{
        checked_sizes.forEach(element => {
            console.log(element);
        });
        const product_response = await fetch(`${HOST}/editProduct`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({
                'id':product?.id,
                'name':name,
                'price':price,
                'sizes':checked_sizes
            })
        })
        
        alert('Изменен продукт  '+product?.article)
        window.location.href = '/admin'

    }

      const handleSize = async(event: React.ChangeEvent<HTMLInputElement>)=>{
        if (event.target.checked ){
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
    


   

    return <div >
        
        <div className="flex flex-row justify-around">
            <Carousel className="w-1/4">
            {images && images.map((i)=>(
                <div key={i}>
                    <Image src={HOST+'/'+i} width={200} height={300}  alt="Image 1" />
                </div>
            ))}
            </Carousel>

            <div>
                <div className="flex flex-row">
                    <h1>Article:</h1>
                    <h3 className="ml-4">{product?.article}</h3>
                </div>
                <div className="flex flex-row mt-2">
                    <h1>Name:<h2>[ {product?.name} ]</h2></h1>
                    <h3 className="ml-4"><input type="text" id="name" onChange={(e)=>setName(e.target.value)}/></h3>
                </div>
                <div className="flex flex-row mt-2">
                    <h1>Price:<h2>[ {product?.price} RUB ]</h2></h1>
                    <h3 className="ml-4"><input type="text"  id="price" onChange={(e)=>setPrice(e.target.value)}/></h3>
                </div>
                <div className="flex flex-row mt-2">
                    <h1>Color:</h1>
                    <h3 className="ml-4">{product?.color_name}</h3>
                </div>
                <div className='flex flex-row justify-between mt-2'>
                {all_sizes.map((el)=>(
                    <div key={el}>
                        <label htmlFor={el}>{el}</label>
                        <input type='checkbox' id={el} className='ml-2' onChange={handleSize} ></input>
                    </div>
                ))}
                </div>
                <br />
                <button className="border border-black p-2" onClick={Submit}>Confirm</button>
            </div>
        </div>

    </div>
}



