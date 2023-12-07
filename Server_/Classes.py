from peewee import * 
from refs import *
db = SqliteDatabase('test.db')



class ColorModel():
    def __init__(self,color:str,sizes:list):
        self.color = color.upper()
        self.sizes = sizes
        

# ! Reference tables
class RefColors(Model):
    id = AutoField(primary_key=True,null=False)
    color_name = CharField(null=False)
    hex_value = CharField(null=False)
    
    class Meta:
            database = db
            db_table = 'RefColors'

class RefSizes(Model):
    id = AutoField(primary_key=True,null=False)
    size_name = CharField(null=False)
    
    class Meta:
            database = db
            db_table = 'RefSizes'
          
            



            

    
# ! MAIN TABLES 
class Product(Model):
        id = AutoField(primary_key=True,null=False)
        article = CharField(null=False,unique=True)
        name = CharField(null=False)
        price = CharField(null=False)
        brand = CharField(null=False)
        category = CharField(null=False)
        color = ForeignKeyField(model=RefColors,backref='Product')
        
        

        class Meta:
            database = db
            db_table = 'Product'
        
        @staticmethod
        def Create(
            article,
            name,
            price,
            brand,
            category,
            color,
            sizes
        ):
            p = Product.create(article=article,name=name,price=price,brand=brand,category=category,color=RefColors.get(RefColors.color_name==color))
            

            for s in sizes:
                SizesToProduct.create(Product_ID=p.id,size_id=RefSizes.get(RefSizes.size_name==s))

            return True

        
        @staticmethod
        def GetByID(id):
            p = (Product.select(Product,RefColors.color_name).where(Product.id==id)
                 .join(RefColors,on=(RefColors.id==Product.color))
                 .dicts()
                 .first()
                 )
            sizes = (Product.select(RefSizes.size_name).where(Product.id==id)
                     .join(SizesToProduct,on=(Product.id==SizesToProduct.Product_ID))
                     .join(RefSizes,on=(RefSizes.id==SizesToProduct.size_id))
                     .dicts()
                     )
            sizes = [i['size_name'] for i in sizes]
            
            return {'product':p,'sizes':list(sizes)}
        
        @staticmethod
        def GetAll():
            p = (Product.select(Product).dicts())
            return list(p)
        
        @staticmethod
        def DelById(id):
            article = (Product.select(Product.article).where(Product.id==id).dicts())
            article = list(article)[0]['article']
            Product.delete_by_id(id)
            return article
        
        @staticmethod
        def Edit(id,name,price,sizes):
            p = Product.get_by_id(id)
            p.name=name
            p.price=price
            
            SizesToProduct.delete().where(SizesToProduct.Product_ID==id).execute()

            for s in sizes:
                SizesToProduct.create(Product_ID=p.id,size_id=RefSizes.get(RefSizes.size_name==s))
            
            p.save()

            return True

             
   

 
        
class User(Model):
    id = AutoField(primary_key=True,null=False)
    login = CharField(null=False)
    password = CharField(null=False)
    
    class Meta:
            database = db
            db_table = 'User'  
    
    @staticmethod
    def GetUser(login,password):
        user_id = User.select(User.id).where(User.password==password,User.login==login).dicts()
        try:
            user_id = list(user_id)[0]['id']
            print(user_id)  
            return user_id 
        except:
            print('None')
            return None
            pass
    
    @staticmethod
    def GetProducts(user_id):
        products = (User.select(Product.id,ProductToUser.size).where(User.id==user_id)
                    .join(ProductToUser,on=(ProductToUser.user_id==user_id))
                    .join(Product,on=(ProductToUser.product_ID==Product.id))
                    .dicts()
                    )
        
        return list(products)
        
            
class ProductToUser(Model):
    user_id = ForeignKeyField(model=User,backref='ProductToUser',on_delete='CASCADE')
    product_ID = CharField(null=False)
    size = CharField(null=False)
    
    class Meta:
            database = db
            db_table = 'ProductToUser'   
    
    @staticmethod
    def Delete(user_id,product_id,size):
        # ProductToUser.delete().where(ProductToUser.product_ID==product_id and ProductToUser.user_id==user_id and ProductToUser.size==size).execute()
        print('Del from cart    --user_id',user_id,'product_id',product_id,'size',size)
        res = (ProductToUser.delete()
        .where((ProductToUser.product_ID==product_id)&  (ProductToUser.user_id==int(user_id)) & (ProductToUser.size==size))
        .execute()
        )

        # print(list(res))
        
    
    
        
        

            
class SizesToProduct(Model):
    Product_ID = ForeignKeyField(model=Product,backref='SizesToProduct',on_delete='CASCADE')
    size_id = IntegerField(null=False)
    
    class Meta:
            database = db
            db_table = 'SizesToProduct'
        


# c1 = ColorModel('green',['X','XL'])
# c2 = ColorModel('black',['X','S'])

# print(Product.GetByBrand_Category('bershka','Top'))
# print(Product.GetByID(6))
        
                  
# ! DB INITIALISE  
def InitialiseDB():
    db.create_tables([
                    RefColors,
                    RefSizes,
                    Product,
                    SizesToProduct,
                    User,
                    ProductToUser,
                    ])

    for i in COLORS:
        RefColors.create(color_name=i,hex_value=COLORS[i])
    for i in SIZES:
        RefSizes.create(size_name=i)

# InitialiseDB()
