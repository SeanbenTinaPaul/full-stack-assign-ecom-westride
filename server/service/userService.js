const prisma = require("../config/prisma");

//Feature/Button: "View All Users", "User Management", "Admin: View Users"
exports.listUsers = async (req, res) => {
   try {
      const users = await prisma.user.findMany({
         select: {
            id: true,
            email: true,
            role: true,
            enabled: true,
            address: true
         }
      });

      res.status(200).json({
         success: true,
         message: "Get to All User Success",
         data: users
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot get all user."
      });
   }
};

//Feature/Button: "Enable/Disable User", "Change User Status", "Admin: Update User Status"
exports.changeStatus = async (req, res) => {
   try {
      const { id, enabled } = req.body;
      const user = await prisma.user.update({
         where: { id: Number(id) },
         data: { enabled: enabled }
      });

      res.status(200).json({
         success: true,
         message: `Update userID: ${id} status to ${enabled}.`
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot change status."
      });
   }
};

//Feature/Button: "Change User Role", "Update User Role", "Admin: Change Role"
exports.changeRole = async (req, res) => {
   try {
      const { id, role } = req.body;
      const user = await prisma.user.update({
         where: { id: Number(id) },
         data: { role: role }
      });

      res.status(200).json({
         success: true,
         message: `Update userID: ${id} role to ${role}.`
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot change role."
      });
   }
};

//ข้อมูลการสั่งซื้อในตะกร้าของ users
//Feature/Button: "Add to Cart", "Update Cart", "Save Cart"
exports.createUserCart = async (req, res) => {
   try {
      const carts = req.body.carts;
      console.log("req.body carts->", req.body.carts);
      console.log("carts->", carts); // [{id:, countCart:, price:, buyPriceNum:,preferDiscount,promotion:,discounts: [ [Object] ]}, {}]
      //1. check ว่า user มีข้อมมูลอยู่ในตาราง User หรือไม่
      const user = await prisma.user.findFirst({
         where: { id: Number(req.user.id) }
      });

      //2. Delete old cart to INSERT new cart
      //table'ProductOnCart' เป็นตารางกลางระหว่าง 'Product' กับ 'Cart'
      /*
          DELETE FROM "ProductOnCart"
              WHERE "cartId" IN (
              SELECT "id" FROM "Cart" 
              WHERE "orderedById" = user.id
              );
          */
      await prisma.productOnCart.deleteMany({
         where: {
            //cart หมายถึง เอา productOnCart.cartId ซึ่งเท่ากับ Cart.id, เมื่อพบว่า Cart.orderedById เท่ากับ user.id
            cart: { orderedById: user.id }
         }
      });
      await prisma.cart.deleteMany({
         where: {
            orderedById: user.id
         }
      });

      // const prodPro = await prisma.product.findMany({
      //    where: {
      //       id: {
      //          in: carts.map((item) => item.id)
      //       }
      //    },
      //    select: {
      //       id: true,
      //       price: true,
      //       promotion: true
      //    }
      // });
      // const today = new Date();
      // const availableDisc = await prisma.discount.findMany({
      //    where: {
      //       isActive: true,
      //       startDate: { lte: today },
      //       endDate: { gte: today },
      //       productId: {
      //          in: carts.map((item) => item.id)
      //       }
      //    },
      //    select: {
      //       id: true,
      //       productId: true,
      //       amount: true,
      //       startDate: true,
      //       endDate: true
      //    }
      // });
      // console.log("prodPro->", prodPro);
      // console.log("availableDiscount->", availableDisc);
      //discount vs promotion
      // if (availableDisc.length > 0) {
      //    console.log("availableDiscount->", availableDisc);
      //    for (let obj of carts) {
      //       let discount = availableDisc.find((d) => d.productId === obj.id);
      //       if (discount) {
      //          item.discount = discount;
      //       }
      //    }
      // }

      //3. เตรียมสินค้าใหม่สำหรับ insert ลงในตาราง ProductOnCart[]
      //req.body.cart ===[{},{},...]
      let products = carts.map((item) => ({
         productId: item.id,
         count: item.countCart,
         price: item.price,
         buyPriceNum: item.buyPriceNum,
         discount: item.preferDiscount
      }));

      //4. หาราคารวมของสินค้าในตะกร้า ลงในตาราง Cart
      let cartTotal = products.reduce((sum, item) => {
         return sum + item.buyPriceNum * item.count;
      }, 0);

      //5. Insert ข้อมูลลงในตาราง Cart
      //data: === INSERT INTO Cart (products, cartTotal, orderById) VALUES (products, cartTotal, orderById)
      // products is ProductOnCart[] in Model Cart
      const newCart = await prisma.cart.create({
         data: {
            products: {
               create: products //add products to ProductOnCart[]
            },
            cartTotal: cartTotal, //add to Cart.cartTotal
            orderedById: user.id //add to Cart.orderedById
         }
      });
      res.status(200).json({
         success: true,
         message: "Add product to cart success",
         productOnCart: products,
         cart: newCart
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot add product to cart."
      });
   }
};
//---------------------------------------------------------------------------
//obj.product.discounts[0].isActive
//obj.product.discounts[0].endDate
//obj.product.discounts[0].amount
//obj.product.promotion
//obj.product.price
const getDiscountAmount = (obj) => {
   //check if isAtive === true (not expired)
   //isAtive === true → can use discount
    // Check if there are any discounts
    if (!obj.product.discounts || obj.product.discounts.length === 0) {
      return null;
   }
   let today = new Date();
   let startDate = new Date(obj.product.discounts[0].startDate);
   let endDate = new Date(obj.product.discounts[0].endDate);
   const discount = obj.product.discounts[0];
   console.log("today", today);
   console.log("endDate", endDate);
   if (discount.isActive && today >= startDate && today < endDate) {
      return discount.amount;
   }
   return null;
};
const calBuyPriceNum = (obj) => {
   const discountAmount = getDiscountAmount(obj);
   let buyPriceNum = obj.product.price;
   let preferDiscount = null;

   if (obj.product.promotion > discountAmount) {
      preferDiscount = obj.product.promotion;
      buyPriceNum = obj.product.price * (1 - obj.product.promotion / 100);
   } else if (obj.product.promotion < discountAmount) {
      preferDiscount = discountAmount;
      buyPriceNum = obj.product.price * (1 - discountAmount / 100);
   }
   // Update the object
   obj.buyPriceNum = buyPriceNum;
   obj.discount = preferDiscount;
   // obj((prev) => ({
   //    ...prev,
   //    buyPriceNum: buyPriceNum,
   //    discount: preferDiscount
   // }));
};
//Feature/Button: "View Cart", "My Cart", "Cart Details"
exports.getUserCart = async (req, res) => {
   try {
      //0. ลองไม่ check user ว่ามีในตาราง User หรือไม่ ก่อน
      //1. หา cart ของ user นั้น
      const cart = await prisma.cart.findFirst({
         where: {
            orderedById: Number(req.user.id)
         },
         // include === JOIN
         include: {
            //products คือ ProductOnCart[]
            products: {
               include: {
                  // ProductOnCart join กับ Product ด้วย productId
                  product: {
                     include: {
                        discounts: true
                     }
                  }
               }
            }
         }
      });
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found."
         });
      }
      //need to validate promotion vs discount → discount needs: isActive, startDate, endDate
      //ต้องการให้ promotion + discount ที่่อยู่ใน Cart + ProductOnCart up-to-date ตลอดเวลา
      /*
      1. discount expired → promotion
      2. discount > promotion → discount
      3. discount < promotion → promotion
      4. promotion: null && discount: null → no promotion, no discount
      */
      //obj.product.discounts[0].isActive
      //obj.product.promotion
      //obj.product.price
      let totalCartDiscount = 0;
      let totalPriceNoDiscount = 0;
      for (const obj of cart.products) {
         calBuyPriceNum(obj);
         totalCartDiscount += (obj.product.price * obj.count) - (obj.buyPriceNum * obj.count);
         totalPriceNoDiscount += (obj.product.price * obj.count);
      }
      //cal promotion vs discount และ to send res with ราคาสุทธิ
      //get promotion from table Product, join to Discount with productId
      // res.send(cart);
      res.status(200).json({
         success: true,
         message: "This is your cart.",
         ProductOnCart: cart.products,
         carts: cart,
         "Total price": cart.cartTotal,
         totalCartDiscount: totalCartDiscount,
         totalPriceNoDiscount: totalPriceNoDiscount
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot get product in cart."
      });
   }
};

//Feature/Button: "Empty Cart", "Clear Cart", "Remove All Items from Cart"
exports.emptyCart = async (req, res) => {
   try {
      //1. หา cart ของ user นั้นว่ามีหรือไม่
      const cart = await prisma.cart.findFirst({
         where: { orderedById: Number(req.user.id) }
      });
      //2. ถ้าไม่มีให้ return 400
      if (!cart) return res.status(400).json({ message: "No cart found." });
      //3. ถ้ามีให้ลบข้อมูลในตาราง ProductOnCart และ Cart ทั้งหมด
      await prisma.productOnCart.deleteMany({
         where: { cartId: cart.id }
      });
      const delCart = await prisma.cart.deleteMany({
         where: { orderedById: Number(req.user.id) }
      });

      res.status(200).json({
         success: true,
         message: "Success!!! Your cart is now empty.",
         "deleted count": delCart.count,
         "deleted cart": delCart, //{"count": 1}
         data: cart
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot empty a cart."
      });
   }
};

//Feature/Button: "Save Address", "Update Address", "Add/Edit Address"
exports.saveAddress = async (req, res) => {
   try {
      const { address } = req.body;
      const addressUser = await prisma.user.update({
         where: { id: Number(req.user.id) },
         data: { address: address.trim() },
         select: { address: true, name: true, email: true, role: true, picture: true,id: true }
      });
      res.status(200).json({
         success: true,
         message: "Update Address Success",
         address: addressUser.address,
         profile: addressUser
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot update address."
      });
   }
};

/*เท่ากับ
where: {
    orderedBy : {
        id: Number(req.user.id)
    }
}
*/
//Feature/Button: "Place Order", "Checkout", "Confirm Order"
exports.saveOrder = async (req, res) => {
   try {
      //1. หา cart ของ user นั้นว่ามีหรือไม่
      //products    ProductOnCart[]
      // userCart จะดึง record แรก ทุกคอลัมน์จาก table 'Cart' orderedById เท่ากับ req.user.id และบางส่วนจาก 'ProductOnCart' ที่มี orderedById เท่ากับ req.user.id
      const userCart = await prisma.cart.findFirst({
         where: {
            orderedById: Number(req.user.id)
         },
         include: {
            products: {
               select: {
                  cartId: true,
                  productId: true,
                  count: true,
                  price: true
               }
            }
         }
      });

      //2. ถ้าไม่มีให้ return 400
      if (!userCart || userCart.products.length === 0)
         return res
            .status(400)
            .json({ message: "Your cart is empty. Please add some product to a cart." });

      //3. Compare: product quantity in cart (userCart.products) vs  product quantity in stock (product.quantity)
      let outStockProd = []; //เก็บ product ที่ไม่มี stock พอ
      for (const item of userCart.products) {
         const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { quantity: true, title: true }
         });
         /*
          item   { cartId: 15, productId: 5, count: 2, price: 40000 }
          product{ quantity: 1000, title: 'Core i9-11800K' }
          item   { cartId: 15, productId: 7, count: 10, price: 250 }
          product{ quantity: 10, title: 'ขาหมูเยอรมัน' }
          */
         if (!product || item.count > product.quantity) {
            outStockProd.push(product?.title || "product");
         }
      }
      //4. if outStockProd.length > 0, return 400
      if (outStockProd.length > 0) {
         return res
            .status(400)
            .json({ message: `Sorry. Product: ${outStockProd.join()} out of stock.` });
      }

      //5. create new Order
      //products    ProductOnOrder[]
      const order = await prisma.order.create({
         data: {
            products: {
               create: userCart.products.map((item) => ({
                  productId: item.productId,
                  count: item.count,
                  price: item.price
               }))
            },
            //connect คือ create record: orderedById ในตาราง Order(ว่าง) ตาม User.id(มีอยู่แล้ว)
            /*
             INSERT INTO "Order" (orderedById, ...)
             VALUES ((SELECT id FROM "User" WHERE id = req.user.id), ...);
             */
            orderedBy: {
               connect: {
                  id: Number(req.user.id) //=== id: userCart.orderedById
               }
            },
            cartTotal: userCart.cartTotal // Ensure cartTotal is included here
         }
      });

      //6. ลบข้อมูลในตาราง ProductOnCart และ Cart ทั้งหมด
      /*
       กระบวนการ:
       - ถ้า create ในตาราง Order แล้วก็ต้องลบในตาราง Cart และ ProductOnCart
       - ในตาราง Product ต้องลบจำนวนสินค้าที่สั่งออกไปจาก stock
       */
      //6.1 เตรียมข้อมูลสำหรับ update จำนวนสินค้าในตาราง Product.sold และ Product.quantity
      const updateProduct = userCart.products.map((item) => ({
         where: { id: item.productId },
         data: {
            sold: { increment: item.count },
            quantity: { decrement: item.count }
         }
      }));
      //6.2 ส่ง updateProduct ไป update ในตาราง Product
      //The key is to collect the promises in an array and then use Promise.all() to wait for all the promises to resolve.
      // await Promise.all([promise1, promise2, ...]) | when promise = {..}
      await Promise.all(updateProduct.map((promise) => prisma.product.update(promise)));

      //6.3 ลบข้อมูลในตาราง ProductOnCart และ Cart ทั้งหมด
      // ติด onDelete: Cascade ในตาราง ProductOnCart.cartId ไว้ → ถ้าลบ record ในตาราง Cart จะลบ record ในตาราง ProductOnCart ด้วย
      await prisma.cart.deleteMany({
         where: { orderedById: Number(req.user.id) }
      });

      res.status(200).json({
         success: true,
         message: "save Order Success",
         data: userCart,
         updateProduct: updateProduct,
         order: order
      });
      //7. records ในตาราง Order และ ProductOnOrder จะไม่ถูกลบ → ใช้เก็บ log การสั่งซื้อทั้งหมดของ users
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot save order."
      });
   }
};

//ข้อมูลประวัติการสั่งซื้อของ users
/*
Order.products    ProductOnOrder[]
ProductOnOrder.product   Product
*/
//Feature/Button: "View Orders", "Order History", "My Orders"
exports.getOrder = async (req, res) => {
   try {
      const orders = await prisma.order.findMany({
         where: { orderedById: Number(req.user.id) },
         include: {
            products: {
               include: { product: true }
            }
         }
      });

      if (orders.length === 0)
         return res.status(400).json({ success: false, message: "No order found." });

      res.status(200).json({
         success: true,
         message: "This is your history order.",
         data: orders
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Get to getOrder Error",
         error: err.message
      });
   }
};
