const getImgFromFolder = async (req, res) => {
    try {
       const { folderName } = req.body;
       console.log("folderName-->", folderName);
 
       if (!folderName) {
          return res.status(400).json({
             success: false,
             message: "Folder name is required"
          });
       }
 
       // config cloudinary with secure
       cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
       });
       //  First, list all root folders to verify existence
       const folders = await new Promise((resolve, reject) => {
          cloudinary.api.root_folders((error, result) => {
             if (error) reject(error);
             else resolve(result);
          });
       });
 
       console.log("Available folders:", folders);
 
       const result = await new Promise((resolve, reject) => {
          cloudinary.api.resources(
             {
                type: "upload",
                prefix: folderName.trim(), // folder name
                // prefix: 'e_com_banner' // folder name
                // prefix: folderName.trim() // folder name
                // max_results: maxResults,
                // direction: order === "desc" ? -1 : 1,
                // // additional options for more details
                // resource_type: "image",
                // metadata: true
             },
             (error, result) => {
                if (error) reject(error);
                else resolve(result);
             }
          );
       });
 
       if (!result.resources || result.resources.length === 0) {
          return res.status(404).json({
             success: false,
             message: `No images found in folder: ${folderName}`,
             data: {
                folderName,
                result
             }
          });
       }
 
       res.status(200).json({
          success: true,
          message: "Images fetched successfully",
          data: {
             resources: result.resources,
             total: result.resources.length,
             folderName: folderName
          }
       });
    } catch (err) {
       console.log("Cloudinary Error:", err);
       res.status(500).json({
          success: false,
          message: "Error fetching images from Cloudinary",
          error: err.message
       });
    }
 };

//-----------------------------------------------------------
 const products = await prisma.product.findMany({
   where: {
      categoryId: catId,
      quantity: { gt: 0 }
   },
   take: prodsPerCat,
   orderBy: {
      updatedAt: "desc"
   },
   include: {
      category: true,
      images: true,
      discounts: true
   }
});
/*
SELECT "Product".*, 
       "Category".*, 
       "Image".*, 
       "Discount".*
FROM "Product"
LEFT JOIN "Category" ON "Product"."categoryId" = "Category"."id"
LEFT JOIN "Image" ON "Product"."id" = "Image"."productId"
LEFT JOIN "Discount" ON "Product"."id" = "Discount"."productId"
WHERE "Product"."categoryId" = $1 AND "Product"."quantity" > 0
ORDER BY "Product"."updatedAt" DESC
LIMIT $2
*/

if (existFav?.isActive) {
   await prisma.favorite.update({
      where: {
         id: existFav.id
      },
      data: {
         isActive: false
      }
   });
   return res.status(200).json({
      success: true,
      message: `Removed productID: ${existFav.id} from favorites`,
      isFavorited: false
   });
} else if (existFav && !existFav?.isActive) {
   await prisma.favorite.update({
      where: {
         id: existFav.id
      },
      data: {
         isActive: true
      }
   });
   return res.status(200).json({
      success: true,
      message: `Add productID: ${existFav.id} to favorites`,
      isFavorited: true
   });
} else {
   await prisma.favorite.create({
      data: {
         userId: id,
         productId: parseInt(productId)
      }
   });
   return res.status(200).json({
      success: true,
      message: `Add productId: ${productId} to favorites`,
      isFavorited: true
   });
}


//------------------------------------------------------------------------------
//handle toggle with upsert() and isActive column
      const favorite = await prisma.favorite.upsert({
         where: {
            userId_productId: {
               userId: id,
               productId: parseInt(productId)
            }
         },
         //→ .update({where:{..}, data:{..}}) | exist → toggle | not exist → true
         update: {
            isActive: existFav ? !existFav.isActive : true
         },
         //→ .create({data:{..}})
         create: {
            userId: id,
            productId: parseInt(productId),
            isActive: true
         },
         select: {
            isActive: true,
            product: {
               select: {
                  title: true
               }
            }
         }
      });

      return res.status(200).json({
         success: true,
         message: favorite.isActive
            ? `Added ${favorite.product.title} to favorites`
            : `Removed ${favorite.product.title} from favorites`,
         isFavorited: favorite.isActive
      });

      //-----------------------------------------------------------------
      //not used
const handleQuery = async (req, res, query) => {
   try {
      const products = await prisma.product.findMany({
         where: {
            title: {
               contains: query
            }
         },
         include: {
            category: true,
            images: true
         }
      });
      res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Search Error" });
   }
};
/* 
SELECT * 
FROM "Product"
WHERE "title" ILIKE '%' || $1 || '%';
คำอธิบาย:
SELECT * FROM "Product":

ดึงข้อมูลทั้งหมดจากตาราง Product.
WHERE "title" ILIKE '%' || $1 || '%':

ค้นหาในคอลัมน์ title ที่มีข้อความบางส่วน (substring) ตรงกับตัวแปร $1.
คำสั่ง ILIKE ใช้สำหรับการค้นหาที่ไม่คำนึงถึงตัวพิมพ์เล็ก/ใหญ่ (case-insensitive).
สัญลักษณ์ % หมายถึง wildcard สำหรับการจับข้อความที่อยู่ก่อนหรือหลังคำที่ค้นหา.
$1:

ตัวแปรที่ใช้แทนค่า query ที่ส่งมาจากผู้ใช้งาน เช่น "apple", "phone", หรือคำค้นหาอื่น.
*/
//not used
const handlePrice = async (req, res, priceRange) => {
   try {
      const products = await prisma.product.findMany({
         where: {
            price: {
               gte: priceRange[0],
               lte: priceRange[1]
            }
         },
         include: {
            category: true,
            images: true
         }
      });
      res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Search Error"
      });
   }
};
//not used...
const handleCategory = async (req, res, categoryIdArr) => {
   try {
      const products = await prisma.product.findMany({
         where: {
            categoryId: {
               in: categoryIdArr.map((id) => Number(id))
            }
         },
         include: {
            category: true,
            images: true
         }
      });
      res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Search Error"
      });
   }
};

generator client {
   provider        = "prisma-client-js"
   previewFeatures = ["driverAdapters"]
 }
 
 datasource db {
   provider = "postgresql"
   url      = env("DATABASE_URL")
 }
 
 model User {
   id             Int          @id @default(autoincrement())
   email          String       @unique
   password       String?
   name           String?
   picture        String?
   role           String       @default("user")
   enabled        Boolean      @default(true)
   address        String?
   createdAt      DateTime     @default(now())
   updatedAt      DateTime     @updatedAt
   carts          Cart[]
   orders         Order[]
   favorites      Favorite[] // เพิ่ม relation กับ Favorite
   productRatings Rating[] // เพิ่ม relation กับ Rating
   userCoupons    UserCoupon[]
   picturePub     String?
   updatedBy      String? //เก็บ email admin ที่เปลี่ยน status user คนอื่น
   // updatedBy      User?        @relation(fields: [updatedById], references: [id])
   // updatedById    Int?
 }
 
 model Product {
   id          Int              @id @default(autoincrement())
   title       String
   description String
   price       Float
   sold        Int              @default(0)
   quantity    Int
   createdAt   DateTime         @default(now())
   updatedAt   DateTime         @updatedAt
   categoryId  Int?
   images      Image[]
   category    Category?        @relation(fields: [categoryId], references: [id])
   cartItems   ProductOnCart[]
   orderItems  ProductOnOrder[]
   promotion   Float? // เก็บค่า % ส่วนลดทั่วไป
   discounts   Discount[] // เพิ่ม relation กับ Discount สำหรับ high-season
   favorites   Favorite[] // เพิ่ม relation กับ Favorite
   ratings     Rating[] // เพิ่ม relation กับ Rating
   avgRating   Float? // เพิ่ม col เก็บค่าเฉลี่ย rating
   brandId     Int?             @default(1) // เพิ่ม col สำหรับเก็บ foreign key ของแบรนด์
   brand       Brand?           @relation(fields: [brandId], references: [id]) // เพิ่ม relation กับ Brand
   createdBy   String?
   updatedBy   String?
   // createdBy   User?    @relation(fields: [createdById], references: [id]) // use to access whole table User | includes: {createdBy:true} 
   // createdById Int?     //foreign key | use with where clause | where: {createdById: 123}
   // updatedBy   User?    @relation(fields: [updatedById], references: [id])
   // updatedById Int?
 }
 
 model Order {
   id           Int              @id @default(autoincrement())
   cartTotal    Float
   orderStatus  String           @default("Not Process")
   createdAt    DateTime         @default(now())
   updatedAt    DateTime         @updatedAt
   orderedById  Int
   orderedBy    User             @relation(fields: [orderedById], references: [id])
   products     ProductOnOrder[]
   ratings      Rating[] // เพิ่ม relation กับ Rating เพื่อตรวจสอบว่าสั่งซื้อแล้วหรือยัง
   paymentId    String           @default("")
   amount       Float            @default(0)
   status       String           @default("")
   currency     String           @default("thb")
   refundAmount Float?           @default(0)
   updatedBy    String? //เก็บ email admin ที่เปลี่ยน status
   // updatedBy    User?    @relation(fields: [updatedById], references: [id])
   // updatedById  Int?
 }
 
 model ProductOnOrder {
   id         Int      @id @default(autoincrement())
   productId  Int
   orderId    Int
   count      Int
   price      Float
   order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
   product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
   discount   Float? // เพิ่มฟิลด์เก็บส่วนลดที่ได้ ณ เวลาที่สั่งซื้อ
   isRefunded Boolean? @default(false)
 }
 
 model Category {
   id        Int       @id @default(autoincrement())
   name      String
   createdAt DateTime  @default(now())
   updatedAt DateTime  @updatedAt
   products  Product[]
   createdBy String?
   // createdBy   User?    @relation(fields: [createdById], references: [id])
   // createdById Int?     //foreign key
 }
 
 model Cart {
   id          Int             @id @default(autoincrement())
   cartTotal   Float
   createdAt   DateTime        @default(now())
   updatedAt   DateTime        @updatedAt
   orderedById Int
   orderedBy   User            @relation(fields: [orderedById], references: [id])
   products    ProductOnCart[]
   // consider adding these fields
   // lastSynced  DateTime        @updatedAt // Track last sync time
   // status      String          @default("active") // Track cart status
 }
 
 model ProductOnCart {
   id          Int     @id @default(autoincrement())
   /// คือเปลี่ยนตาม id (is independent) ใน table 'Cart'
   cartId      Int
   productId   Int
   count       Int
   price       Float
   cart        Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
   product     Product @relation(fields: [productId], references: [id])
   //adding these to support discounts
   buyPriceNum Float // Store discounted price at time of adding
   discount    Float? // Store applied discount
 }
 
 model Image {
   id         Int      @id @default(autoincrement())
   asset_id   String
   public_id  String
   url        String
   secure_url String
   createdAt  DateTime @default(now())
   updatedAt  DateTime @updatedAt
   productId  Int?
   product    Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
   // brand      Brand?   @relation(fields: [brandId], references: [id], onDelete: Cascade)
   // brandId    Int? // เพิ่ม field สำหรับเก็บ foreign key ของแบรนด์
 }
 
 //  Favorite feature
 model Favorite {
   id        Int      @id @default(autoincrement())
   user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   userId    Int
   product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
   productId Int
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
 
   @@unique([userId, productId]) // ป้องกันการเพิ่ม favorite ซ้ำ →  compound unique constraint
   /**
    * where: {
    * userId_productId: {  // This is the compound key
    * userId: id,
    * productId: parseInt(productId)
    * }
    */
   /**
    * /**
    * /**
    * /**
    * /**
    * /**
    * /**
    * // User 1 cannot have Product 1 twice in his cart/favorites
    * {userId: 1, productId: 1} ✅ // Allowed
    * {userId: 1, productId: 1} ❌ // Rejected - duplicate
    * {userId: 1, productId: 2} ✅ // Allowed - different product
    * {userId: 2, productId: 1} ✅ // Allowed - different user
    */
   @@index([userId])
   @@index([productId])
 }
 
 //  Rating feature
 model Rating {
   id        Int      @id @default(autoincrement())
   rating    Int // เก็บคะแนน 1-5
   user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   userId    Int
   product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
   productId Int
   order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
   orderId   Int
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   comment   String?
 
   @@unique([userId, productId, orderId, comment]) // ป้องกันการให้ rating ซ้ำในแต่ละ order record
 }
 
 // สำหรับ Seasonal Discount
 model Discount {
   id          Int      @id @default(autoincrement())
   product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
   productId   Int
   amount      Float // เก็บค่า%ส่วนลด
   startDate   DateTime // วันที่เริ่มต้นส่วนลด
   endDate     DateTime // วันที่สิ้นสุดส่วนลด
   description String? // คำอธิบาย เช่น "High Season Sale"
   isActive    Boolean  @default(true)
   createdAt   DateTime @default(now())
   updatedAt   DateTime @updatedAt
   createdBy   String // เก็บ email ของ admin ที่สร้าง discount
   // createdBy   User?    @relation(fields: [createdById], references: [id])
   // createdById Int?     //foreign key
 
   /**
    * // Querying promotions between dates becomes faster
    * const promotions = await prisma.promotion.findMany({
    * where: {
    * startDate: {
    * gte: new Date('2024-01-01'),
    * lte: new Date('2024-12-31')
    * }
    * }
    * });
    */
   @@index([startDate, endDate]) // เพิ่ม index เพื่อการค้นหาที่เร็วขึ้น, but not create index record
 }
 
 model Coupon {
   id          Int          @id @default(autoincrement())
   code        String       @unique
   type        String       @default("FREE_SHIPPING") // For future coupon types
   amount      Int // Number of available coupons
   startDate   DateTime
   endDate     DateTime
   isActive    Boolean      @default(true)
   createdAt   DateTime     @default(now())
   updatedAt   DateTime     @updatedAt
   createdBy   String // Admin email
   userCoupons UserCoupon[]
   // createdBy   User?    @relation(fields: [createdById], references: [id])
   // createdById Int?     //foreign key
 }
 
 // For tracking which users have claimed which coupons
 model UserCoupon {
   id        Int       @id @default(autoincrement())
   user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
   userId    Int
   coupon    Coupon    @relation(fields: [couponId], references: [id], onDelete: Cascade)
   couponId  Int
   usedAt    DateTime? // null means claimed but not used yet
   createdAt DateTime  @default(now())
   updatedAt DateTime  @updatedAt
 
   @@unique([userId, couponId]) // Prevent user from claiming same coupon twice
 }
 
 model Brand {
   id          Int       @id @default(autoincrement())
   title       String    @unique // ชื่อ brandต้องไม่ซ้ำกัน
   description String?
   // image      Image
   products    Product[]
   img_url     String?
   // asset_id    String?
   public_id   String?
   createdAt   DateTime  @default(now())
   updatedAt   DateTime  @updatedAt
   createdBy   String
   updatedBy   String?
 }
 