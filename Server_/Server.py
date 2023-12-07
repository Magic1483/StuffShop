from fastapi import FastAPI,Response
import json
from Classes import *
import os 
from PIL import Image
import io
import shutil
from fastapi.responses import StreamingResponse,FileResponse,JSONResponse
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File,UploadFile,status
from typing import List



app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def get_product(req:Request):
    data = await req.json()
    Product.Create(
        article=data['article'],
        name=data['name'],
        price=data['price'],
        brand='ZARA',
        category='CLOTHES',
        color=data['color'],
        sizes=data['sizes']
    )
    print(data)
    print(data['sizes'])
    return {"Accepted"}

@app.post("/editProduct")
async def edit_product(req:Request):
    data = await req.json()
    
    r = Product.Edit(data['id'],data['name'],data['price'],data['sizes'])

    print(f'Edit product {data["id"]} result: {r}')
    return {"Accepted"}

@app.post("/upload_imgs")
async def get_imgs(images: List[UploadFile] = File(...)):
    article = images[0].filename.replace(images[0].filename.split('_')[-1],'')[:-1]
    
    if not os.path.isdir(f'imgs\\{article}'):
        os.mkdir(f'imgs\\{article}')
    
    
    for i in images:
        contents = await i.read()
        with open(f'imgs\\{article}\\{i.filename}','wb') as f:
            f.write(contents)
            
    return {"Accepted"}

@app.post("/del_product")
async def del_product(req:Request):
    data = await req.json()
    print('delete by id ',data['product_id'])
    artcile = Product.DelById(int(data['product_id']))
    shutil.rmtree(f'imgs\\{artcile}')
    return {"Accepted"}

@app.post("/login")
async def login(req:Request):
    data = await req.json()
    usr_id = User.GetUser(data['login'],data['password'])
    print(usr_id)
    return {"user_id":usr_id}

@app.post("/register")
async def login(req:Request):
    data = await req.json()
    User.create(login=data['login'],password=data['password'])
    return {"Accepted"}

@app.post("/addProduct")
async def addProduct(req:Request):
    data = await req.json()
    ProductToUser.create(user_id=data['user_id'],product_ID=data['product_id'],size=data['size'])
    
    return {"Accepted"}

@app.post("/DelFromcart")
async def DelFromcart(req:Request):
    data = await req.json()
    ProductToUser.Delete(user_id=data['user_id'],product_id=data['product_id'],size=data['size'])
    
    return {"Accepted"}
    
    
# GET -------------------------------------------
@app.get("/")
async def read_root():
    return {"Hello": "World"}


  
@app.get("/items")
async def getByBrand_Category():
    return Product.GetAll()

@app.get("/getProducts/{user_id}")
async def getProducts(user_id):
    products =User.GetProducts(user_id)
    res = []
    for i in products:
        t = Product.GetByID(i['id'])
        res.append({'product':t['product'],'size':i['size']})
        
    return res

@app.get("/items/{id}")
async def getById(id):
    return Product.GetByID(id)
  

  
@app.get("/img_list/{article}")
async def getImgs(article):
  image_urls = []
  for filename in os.listdir(f'imgs\\{article}'):
          if filename.endswith(".jpg") or filename.endswith(".png"):
              image_url = f"imgs/{article}/{filename}"
              image_urls.append(image_url)
  
            
  return image_urls

@app.get("/img/{article}")
async def getImg(article,response: Response):
    # img = Image.open(f"imgs/{article}/{article}_1.jpg")

    return FileResponse(f"imgs/{article}/{article}_1.jpg")


@app.get("/imgs/{folder}/{name}")
async def getImgF(folder,name):
    # img = Image.open(f"imgs/{path}")
    
    return FileResponse(f"imgs/{folder}/{name}")
  


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)