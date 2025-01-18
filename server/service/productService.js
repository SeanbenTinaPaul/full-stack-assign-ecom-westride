const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2; // import { v2 as cloudinary } from 'cloudinary';

exports.create = async (req, res) => {
   try {
      const { title, description, price, quantity, categoryId, images } = req.body;
      // console.log('req.body.images->', images)
      //verify res.body data if they are not null or undefined
      if (!title || !price || !quantity || !categoryId || Number(categoryId) === 0) {
         return res.status(400).json({ message: "All fields are required" });
      }

      const product = await prisma.product.create({
         //data === insert into
         data: {
            title: title,
            description: description ? description : "",
            price: parseFloat(price),
            quantity: parseInt(quantity),
            categoryId: parseInt(categoryId),
            //เป็น one-to-many จึงต้องใช้ object ในการเก็บค่า ***เดี๋ยวกลับมาทำ
            // 1 product มีหลาย images
            // ถ้าเพิ่มรูปใน table 'Product' จะเพิ่มใน table 'Image' ด้วย
            images: {
               create: images.map((obj) => ({
                  asset_id: obj.asset_id,
                  public_id: obj.public_id,
                  url: obj.url,
                  secure_url: obj.secure_url
               }))
            }
         }
      });

      res.send(product);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.list = async (req, res) => {
   try {
      //findMany === SELECT * from TableName
      //take === LIMIT
      const { count } = req.params;
      const products = await prisma.product.findMany({
         take: parseInt(count),
         orderBy: {
            createdAt: "desc"
         },
         //include === JOIN
         //เพิ่มเพื่อดึงข้อมูลจากตาราง category
         include: {
            category: true,
            images: true,
            discounts: true,
            favorites: true,
            ratings: true
         
            /*
                model Product {
                    category Category? @relation(fields: [categoryId], references: [id])  // Points to one category
                    images   Image[]  // Has many images
                }
                */
         }
      });

      res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

//อ่านข้อมูลเดียว ตาม id
exports.read = async (req, res) => {
   try {
      //findFirst === SELECT * from TableName WHERE id = ?
      //take === LIMIT
      const { id } = req.params;
      const products = await prisma.product.findFirst({
         where: {
            id: parseInt(id)
         },
         //include === JOIN
         //เพิ่มเพื่อดึงข้อมูลจากตาราง category...
         include: {
            category: true,
            images: true
            /*
                model Product {
                    category Category? @relation(fields: [categoryId], references: [id])  // Points to one category
                    images   Image[]  // Has many images
                }
                */
         }
      });
      res.status(200).json({
         success: true,
         data: products
      });
      // res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

/* แบบย่อ
const product = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: {
        ...existingProduct,
        ...req.body, // แทนค่าที่ส่งมาเท่านั้น
    },
});
*/
//update → ไป copy try ของ create มา → เปลี่ยน .create เป็น .update
exports.update = async (req, res) => {
   try {
      //req.body === inputForm → form in Frontend
      const { title, description, price, quantity, categoryId, images } = req.body;

      // ดึงข้อมูลปัจจุบันจากฐานข้อมูล
      //findUnique === SELECT * from TableName WHERE id = ?
      const existingProduct = await prisma.product.findUnique({
         where: { id: parseInt(req.params.id) },
         include: { images: true } // ดึงข้อมูล images ด้วย
      });
      /*
      existingProduct==={
         id: number,
         title: string,
         description: string,
         price: number,
         sold: number,..,
         images: [  // Array of image objects
                  {
                     id: number,
                     asset_id: string,
                     public_id: string,
                     url: string,
                     productId: number
                  },...
                ]
               };
      */
      if (!existingProduct) {
         return res.status(404).json({ message: "Product not found" });
      }
      //verify if user sent the same images.id → not delete that image in DB
      
      /*
      // Create a set of existing image IDs for faster lookup
         const existingImageIds = new Set(existingProduct.images.map(img => img.id));

      // Filter out images that are not in the existing images
         const imgIdNotDel = images.filter(img => !existingImageIds.has(img.id));
      */

      //ลบรูปเก่า(เฉพาะใน DB) ออกก่อนเพื่อ insert รูปใหม่
      //ต้องเพิ่ม list product ใน req path ด้วยเพื่อแสดงรายละเอียดของ product ที่ต้องการแก้ไข
      await prisma.image.deleteMany({
         where: {
            productId: parseInt(req.params.id)
         }
      });
      const product = await prisma.product.update({
         where: {
            id: parseInt(req.params.id)
         },
         //data === INSERT INTO
         //ถ้าไม่ได้ส่งfieldใดใน req.body มา จะใช้ข้อมูลเดิม
         data: {
            title: title || existingProduct.title,
            description: description || existingProduct.description,
            price: price !== undefined ? parseFloat(price) : existingProduct.price,
            quantity: quantity !== undefined ? parseInt(quantity) : existingProduct.quantity,
            categoryId:
               categoryId !== undefined ? parseInt(categoryId) : existingProduct.categoryId,
            //เป็น one-to-many จึงต้องใช้ object ในการเก็บค่า ***เดี๋ยวกลับมาทำ
            // 1 product มีหลาย images
            // ถ้าเพิ่มรูปใน table 'Product' จะเพิ่มใน table 'Image' ด้วย
            images: images
               ? {
                    create: images.map((img) => ({
                       asset_id: img.asset_id,
                       public_id: img.public_id,
                       url: img.url,
                       secure_url: img.secure_url
                    }))
                 }
               : undefined // ถ้าไม่มีการส่ง images จะไม่อัปเดต images
         }
      });

      res.status(200).json({
         success: true,
         data: product
      });
      // res.send(product);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

//del a product in db 
//ต้อง Del รูปทั้งใน table 'Image' และใน cloud ด้วย
exports.remove = async (req, res) => {
   try {
      const { id } = req.params;
      //for sending res.title to frontend
      const productToRm = await prisma.product.findUnique({
         where: {
            id: Number(id)
         },
         include: {
            images: true
         }
      });
      console.log("productToRm->", productToRm);
      //del process: del record from table 'Product' + del images from table 'Image' + del img from cloudinary
      await prisma.product.delete({
         where: {
            id: Number(id)
         }
      });

      /*
      roductToRm.images === [
                              {
                              "id": 900,
                              "asset_id": "788964f30ee2768df55f6539c039f649",
                              "public_id": "Ecom_fullstack_app_msc_products/product-1736767026915",
                              "url": "http://res.cloudinary.com/dvzlnabwf.jpg",
                              "secure_url": "https://res.cloudinary.com/dvzlnabwf/image/.jpg",
                              "createdAt": "2025-01-13T11:17:12.276Z",
                              "updatedAt": "2025-01-13T11:17:12.276Z",
                              "productId": 31
                              }, {..}
                           ]
      */
      // Delete the images from Cloudinary
      let imgToRm = [];
      for (const image of productToRm.images) {
         imgToRm.push(
            new Promise((resolve, reject) => {
               cloudinary.uploader.destroy(image.public_id, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
               });
            })
         );
      }
      await Promise.all(imgToRm);
      /*
      for (const image of productToRm.images) {
         await cloudinary.uploader.destroy(image.public_id);
      }
      */

      res.status(200).json({
         success: true,
         message: "Remove success",
         data: productToRm
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

//ใช้แสดงสินค้าเรียงตามความนิยม
exports.listBy = async (req, res) => {
   try {
      //ต้องการ req 3 อย่าง: sort<เรียงอะไร?>, order<มากไปน้อย?>, limitฒ<จำนวนที่ต้องการ?>
      const { sort, order, limit } = req.body;
      const products = await prisma.product.findMany({
         take: limit,
         //[sort] เพื่อเอา value จาก key sort มาใช้
         orderBy: { [sort]: order },
         include: { category: true }
      });
      res.send(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

/*อยากให้ search 3 วิธี
1. ตามที่พิมพ์ลงช่อง input
2. ตามติ๊ก ✔ ช่อง category
3. ตามราคา */
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
      res.status(200).json({
         success: true,
         count: products.length,
         message: products.length ? "Products found" : "No products found",
         data: products
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Search Error"
      });
   }
};

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
      res.status(200).json({
         success: true,
         count: products.length,
         message: products.length ? "Products found" : "No products found",
         data: products
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Search Error"
      });
   }
};

exports.searchFilters = async (req, res) => {
   try {
      const { query, category, price } = req.body;
      if (query) {
         console.log("query-->", query);
         await handleQuery(req, res, query);
      }
      if (category) {
         console.log("category-->", category);
         await handleCategory(req, res, category);
      }
      if (price) {
         console.log("price-->", price);
         await handlePrice(req, res, price);
      }

      // res.send("searchFilters");
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

// mange image file on cloudinary ONLY !!!
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

//accroding to Frontend, uploadImages() is called before create()
exports.uploadImages = async (req, res) => {
   try {
      // console.log('req.body ->',req.body);
      // console.log('req.body img ->',req.body.image);
      const result = await cloudinary.uploader.upload(req.body.image, {
         public_id: `product-${Date.now()}`,
         resource_type: "auto",
         folder: "Ecom_fullstack_app_msc_products" // create this folder in cloudinary automatically
      });
      res.status(200).json({
         success: true,
         message: "Upload success",
         data: result
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.removeImage = async (req, res) => {
   //if method doesn't return Promise by default → use new Promise
   try {
      // table Image in db also has public_id col
      // console.log("public_id-->", req.body.public_id);
      await new Promise((resolve, reject) => {
         cloudinary.uploader.destroy(req.body.public_id, (error, result) => {
            if (error) reject(error); //trigger .catch() or catch(err){..}
            else resolve(result); //trigger .then() method or do next code in try{..}
         });
      });
      res.status(200).json({
         success: true,
         message: "Remove img from cloud success"
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

/*
//in case Cloudinary support return Promise by default ▼
exports.removeImage = async (req, res) => {
   try {
      await cloudinary.uploader.destroy(req.body.public_id, (err, resolve) => {
         if (err) return res.status(500).json({ message: "Server Error" });
         else return res.status(200).json({ message: "Remove img from cloud success" });
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};
*/

/*
req.body === 
   {
      products:[ {id:1, title:test ,... images:[]} ],
      amount:0,
      startDate: "",
      endDate: "",
      description: "",
      isPromotion: true
   }
*/
exports.handleBulkDiscount= async(req, res)=> {
   const { products, amount, startDate, endDate, description, isPromotion } = req.body;
   
   try {
     if (isPromotion) {
       // อัพเดตฟิลด์ promotion ในตาราง Product
       await prisma.product.updateMany({
         where: {
           id: {
             in: products.map(p => p.id)
           }
         },
         data: {
           promotion: amount
         }
       });
     } else {
       // สร้าง records ในตาราง Discount
       await prisma.discount.createMany({
         data: products.map(product => ({
           productId: product.id,
           amount: amount,
           startDate: new Date(startDate),
           endDate: new Date(endDate),
           description: description,
           isActive: true,
           createdBy: req.user.email
         }))
       });
     }
     
     res.status(200).json({ message: `Discount applied on ${products.length} products successfully` });
   } catch (error) {
      console.log(error);
     res.status(500).json({ error: "Failed to apply discount" });
   }
 }