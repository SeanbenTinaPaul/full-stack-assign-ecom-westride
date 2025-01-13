const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

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
            images: true
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
      const { title, description, price, quantity, categoryId, images } = req.body;

      // ดึงข้อมูลปัจจุบันจากฐานข้อมูล
      //findUnique === SELECT * from TableName WHERE id = ?
      const existingProduct = await prisma.product.findUnique({
         where: { id: parseInt(req.params.id) },
         include: { images: true } // ดึงข้อมูล images ด้วย
      });

      if (!existingProduct) {
         return res.status(404).json({ message: "Product not found" });
      }
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
      console.log('productToRm->',productToRm);
      //del process: del record from table 'Product' + del images from table 'Image' + del img from cloudinary
      await prisma.product.delete({
         where: {
            id: Number(id)
         },
      });

      // Delete the images from Cloudinary
      for (const image of productToRm.images) {
         await cloudinary.uploader.destroy(image.public_id);
      }

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
   try {
      // table Image in db also has public_id col
      // console.log("public_id-->", req.body.public_id);
      await cloudinary.uploader.destroy(req.body.public_id, (resolve, reject) => {
         res.status(200).json({
            success: true,
            message: "Remove success",
            data: resolve
         });
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};
