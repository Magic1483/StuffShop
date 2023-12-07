"use client"
import { SetStateAction, useEffect,useState } from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { HOST } from "@/constant";

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

interface UserCart {
    product_id:string,
    size:string
}

export default function Product({params:{id}}:Props){
    const [product, setProduct] = useState<Product>()
    const [images,setImages] = useState<string[]>([])
    const [user_id,setUser_id] = useState<any>('')
    const [sizes,setSizes] = useState<string []>([])
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(()=>{
        const  getData= async () => {
          const data = await fetch(`${HOST}/items/${id}`)
          const res = await data.json()
    
            
          console.log(res['product']);
          res && setProduct(res['product'])
          setSizes(res['sizes'])
          
          
          const img_data = await fetch(`${HOST}/img_list/${res['product']['article']}`)
          const imgs = await img_data.json()
          console.log(imgs);
          imgs && setImages(imgs)
            
          
        }
        getData();
        (async()=>{
            const user_id = await getUser()
            console.log('user_id',user_id);
            
            
            setUser_id(user_id)
        })();
        
      },[])
    
    const AddToCart = async () =>{
        if(user_id!=null && product!=undefined && selectedOption!=''){

            const user_products = await getUserProducts(user_id)
            let flag = true
            // console.log(user_products);


            user_products.forEach((element: { [x: string]: any; }) => {
                
                if (product.id==element['product']['id'] && selectedOption==element['size']) {
                    alert('Product always exists');
                    flag = false
                }
            });


            
            
            if(flag==true){
                    const resp = await fetch(`${HOST}/addProduct`,{
                    method:'POST',
                    body:JSON.stringify({
                        'user_id':user_id,
                        'product_id':product?.id,
                        'size':selectedOption
                    })
                })
                alert('Продукт добавлен в корзину   '+product.article)
            }
            
        }
    }

    const handleOptionChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
      };

    return <div >
        
        <div className="flex flex-row justify-around">
            <Carousel className="w-1/4">
            {images && images.map((i)=>(
                <div key={i}>
                    <img src={HOST+'/'+i} width={200} height={300}  alt="Image 1" />
                </div>
            ))}
            </Carousel>

            <div>
                <div className="flex flex-row">
                    <h1>Article:</h1>
                    <h3 className="ml-4">{product?.article}</h3>
                </div>
                <div className="flex flex-row">
                    <h1>Name:</h1>
                    <h3 className="ml-4">{product?.name}</h3>
                </div>
                <div className="flex flex-row">
                    <h1>Price:</h1>
                    <h3 className="ml-4">{product?.price} RUB</h3>
                </div>
                <div className="flex flex-row">
                    <h1>Color:</h1>
                    <h3 className="ml-4">{product?.color_name}</h3>
                </div>
                <div className="flex flex-row">
                {sizes.map((option, index) => (
                    <div key={index} className="mr-2">
                    <input
                        type="radio"
                        name="radioGroup"
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                        className="mr-1"
                    />
                    <label>{option}</label>
                    </div>
                ))}
                </div>
                <br />
                <button className="border border-black p-2" onClick={AddToCart}>Add to cart</button>
            </div>
        </div>

    </div>
}


async function getUser(){
    
    try{
        const { data } = await axios.get("/api/me");
        return data['user_id']}
    catch{
        return null
    }

}

async function getUserProducts(user_id:string){
    
    const { data } = await axios.get(`${HOST}/getProducts/${user_id}`);
    return data
    
}
