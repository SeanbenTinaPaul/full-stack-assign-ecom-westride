const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2; // import { v2 as cloudinary } from 'cloudinary';

exports.createProd = async (req, res) => {
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

const updateDiscount = async () => {
   try {
      //auto check and update expired seasonal discount everytime frontend fetch product
      //use UTC time
      const now = new Date();
      const expiredDiscounts = await prisma.discount.findMany({
         where: {
            endDate: { lt: now }, //if endDate gte now → not expired
            isActive: true
         }
      });
      // console.log('new date',new Date())
      // console.log("now", now);
      console.log("expiredDiscounts", expiredDiscounts);
      // Reset expired discounts
      if (expiredDiscounts.length > 0) {
         await prisma.discount.updateMany({
            where: {
               id: {
                  in: expiredDiscounts.map((d) => d.id)
               }
            },
            data: {
               isActive: false
            }
         });
      }
   } catch (err) {
      console.log(err);
   }
};

exports.listProd = async (req, res) => {
   // console.log("req to list", req);
   // console.log("req.user to list", req.user);//undefined when NO <token> sent in req.header
   try {
      await updateDiscount();
      //----------------------------------------------------------------------------
      //findMany === SELECT * from TableName
      //take === LIMIT
      const { count } = req.params;
      const {range} = req.body;
      console.log("range->", range);
      const products = await prisma.product.findMany({
         where: {
            quantity: { gte: range }
         },
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
exports.readAprod = async (req, res) => {
   console.log("req.user to read", req.user);
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
exports.updateProd = async (req, res) => {
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
exports.removeProd = async (req, res) => {
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
exports.displayProdBy = async (req, res) => {
   try {
      //auto-update expired discount
      await updateDiscount();
      //------------------------------------------------------------------------
      //ต้องการ req 3 อย่าง: sort<col?>, order<มากไปน้อย?>, limit<จำนวนที่ต้องการ?>
      const { sort, order, limit } = req.body;
      const products = await prisma.product.findMany({
         where: {
            quantity: { gt: 0 }
         },
         take: limit,
         orderBy: { [sort]: order },
         include: { category: true, images: true, discounts: true }
      });
      res.status(200).json({
         success: true,
         data: products
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.displayProdByUser = async (req, res) => {
   const { id } = req.user;
   try {
      const favCatArr = await prisma.order.findMany({
         where: {
            orderedById: id,
            OR: [{ status: "succeeded" }, { orderStatus: "Completed" }]
         },
         include: {
            products: {
               include: {
                  product: {
                     include: {
                        category: true
                     }
                  }
               }
            }
         }
      });

      //{'1': 5, '2': 3}
      const catcount = {};
      for (const order of favCatArr) {
         for (const product of order.products) {
            const catId = product.product.categoryId;
            if (catId) {
               catcount[catId] = (catcount[catId] || 0) + 1;
            }
         }
      }

      //get top 5 cat | topCat===[1, 2, 3, 4, 5]
      const topCat = Object.entries(catcount)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 5)
         //[catId] = pair[0]
         .map(([catId]) => parseInt(catId));

      if (topCat.length === 0) {
         return res.status(200).json({
            success: true,
            message: "No purchase history found",
            data: []
         });
      }

      //get 2 or 5 products from each category and group them
      const recomProdsCat = {}; //{ "1": [{prod1}, {prod2}], "2": [{prod3}, {prod4}] }
      const prodsPerCat = topCat.length > 2 ? 2 : 5;

      for (const catId of topCat) {
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

         // Store directly in the grouped format
         recomProdsCat[catId] = products;
      }
      //recomProdArr===[{prod1},{prod2}]
      const recomProdArr = Object.values(recomProdsCat).flat();
      res.status(200).json({
         success: true,
         data: { recomProdsCat: recomProdsCat, topCat: topCat, recomProdArr: recomProdArr }
      });
      /*
      data: {
         topCat: [1, 2, 3, 4, 5], // category IDs
         recomProdsCat: {
            "1": [product1, product2],
            "2": [product3, product4],
                     }
            }
      */
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error retrieving personalized recommendations"
      });
   }
};

/*อยากให้ search 3 วิธี
1. ตามที่พิมพ์ลงช่อง input
2. ตามติ๊ก ✔ ช่อง category
3. ตามราคา */
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

//req.body === {category: [7,1], query: 'tes', price: [0, 100]}
exports.searchFilters = async (req, res) => {
   try {
      const { query, category, price } = req.body;

      /*1. สร้าง obj เก็บค่าล่วงหน้า สำหรับส่งไป query DB โดย
      ตั้งชื่อ key ให้เหมือนชื่อคอลัมน์ใน DB และ method ของ prisma
         {
         title: { contains: "tes" },
         categoryId: { in: [7,1] },
         price: { gte: 0, lte: 100 }
         }
      */
      const whereConditions = {};
      //2. เก็บตาม key ใน req.body ที่ส่งมา
      if (query.toString().trim() !== "") {
         whereConditions.title = {
            contains: query.toString().trim(),
            mode: "insensitive" //to ignore case → .toLowerCase() didnt work.
         };
      }
      if (category && category.length > 0) {
         whereConditions.categoryId = {
            in: category.map((id) => {
               const intId = parseInt(id);
               if (isNaN(intId)) {
                  throw new Error(`Invalid category id: ${id}`);
               } else {
                  return intId;
               }
            })
         };
      }
      if (price && price.length === 2) {
         whereConditions.price = {
            gte: parseFloat(price[0]),
            lte: parseFloat(price[1])
         };
      }

      const products = await prisma.product.findMany({
         where: whereConditions,
         include: {
            category: true,
            images: true,
            discounts: true,
            favorites: true,
            ratings: true
         }
      });

      res.send(products);
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
      products:[ {id:1, title:test ,... images:[]}, {..} ],
      amount:0,
      startDate: "2025-01-17T21:58:44.063Z",
      endDate: "2025-01-17T21:58:44.063Z",
      description: "",
      isPromotion: true
   }

   isPromotion===true for promotion
   isPromotion===false for discount
*/
exports.handleBulkDiscount = async (req, res) => {
   const { products, amount, startDate, endDate, description, isPromotion } = req.body;
   const { email } = req.user; //can access req.user bc <token> sent in req.headers.authorization
   // console.log("req.user to handleBulkDiscount", req.user);
   // console.log("isPromotion", isPromotion);
   try {
      //need to replace the old discounts with new discounts
      const existProdWithDiscounts = await prisma.product.findMany({
         where: {
            id: {
               in: products.map((obj) => obj.id)
            }
         },
         include: {
            discounts: true
         }
      });
      console.log("existProdWithDiscounts-->", existProdWithDiscounts);

      //Make: existProdWithDiscounts[i].discounts===[ [], [{1}] ,[{2}] ] → [{1},{2}]
      //Way2: let existingDiscount = existProdWithDiscounts.map((d) => d.discounts).flat();
      let existingDiscount = [].concat(...existProdWithDiscounts.map((obj) => obj.discounts));
      console.log("existingDiscount-->", existingDiscount);

      let prodToCreate = [];
      let prodToUpdate = products.filter((obj) => {
         for (let i = 0; i < existProdWithDiscounts.length; i++) {
            if (existingDiscount.length > 0 && obj.id === existingDiscount[i].productId) {
               return true;
            } else {
               prodToCreate.push(obj);
               return false;
            }
         }
      });
      console.log("prodToCreate-->", prodToCreate);
      console.log("prodToUpdate-->", prodToUpdate);
      const promises = [];
      //if existProdWithDiscounts is empty, then create new discounts
      if (isPromotion) {
         //อัพเดตฟิลด์ promotion ในตาราง Product
         promises.push(
            prisma.product.updateMany({
               where: {
                  id: {
                     in: products.map((obj) => obj.id)
                  }
               },
               data: {
                  promotion: amount
               }
            })
         );
      } else {
         // update existing discounts และสร้าง new discounts พร้อมกัน
         // Validate dates | .getTime() จะ returns the number of milliseconds since January 1, 1970, 00:00:00 UTC
         // if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
         //    return res.status(400).json({ error: "Invalid date format" });
         // }

         if (prodToUpdate.length > 0) {
            promises.push(
               prisma.discount.updateMany({
                  where: {
                     productId: {
                        in: prodToUpdate.map((obj) => obj.id)
                     }
                  },
                  data: {
                     amount: amount,
                     startDate: new Date(startDate),
                     endDate: new Date(endDate),
                     description: description,
                     isActive: true,
                     createdBy: email
                  }
               })
            );
         }
         if (prodToCreate.length > 0) {
            promises.push(
               prisma.discount.createMany({
                  data: prodToCreate.map((obj) => ({
                     productId: obj.id,
                     amount: amount,
                     startDate: new Date(startDate),
                     endDate: new Date(endDate),
                     description: description,
                     isActive: true,
                     createdBy: email
                  }))
               })
            );
         }
      }
      let result = await Promise.allSettled(promises);
      console.log("result promise all-->", result);
      return res.status(200).json({
         message: `Discount applied on ${products.length} products successfully`
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to apply discount" });
   }
};

//for toggle isActive seasonal discount of prod
//pending...
/*
Need req.body:
1. productId
2. status (true or false)
*/
//pending...
exports.changeStatusDiscount = async (req, res) => {
   try {
      const { productIdArr, status } = req.body;
      const result = await prisma.discount.updateMany({
         where: { productId: { in: productIdArr } },
         data: { isActive: status }
      });

      res.status(200).json({
         success: true,
         message: `Update userID: ${productIdArr} status to ${status}.`
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot change status."
      });
   }
};
