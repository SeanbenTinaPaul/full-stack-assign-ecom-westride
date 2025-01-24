//ใช้แทน Redux ในการสร้าง Global State ► เรียกใช้งานได้ทั่วทั้ง workspace
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; //ใช้เก็บข้อมูลที่ user กรอกลง inout ไว้ใน localStorage
import { listCategory } from "../api/CategoryAuth.jsx";
import { listProduct, seachFilterProd } from "../api/ProductAuth.jsx";
import _, { update } from "lodash"; // for making unique el array
import { binarySearchProdId } from "@/utilities/binarySearch.js";
const apiUrl = import.meta.env.VITE_API_URL;

//get is a function that allows you to retrieve the current state of the store.
//set and get functions to update and retrieve the state of the ecomStore store in React components.
const ecomStore = (set, get) => ({
   user: null, //ตั้งค่า null ไว้รอ res.data ก่อน
   token: null,
   categories: [],
   products: [],
   carts: [],

   //to make carts display up-to-date(promotion or discount)
   //productData for 1 prod | ==={id(productId), buyPrice, buyPriceNum, promotion, preferDiscount} แต่ไม่มี countCart
   /*
    list to do ☺☺☺
    1. ไปรับ productData มาจาก CardProd.jsx เหมือน addToCart()
    2. ไปเอา productData มาเปลี่ยนค่าใน carts ที่มี id ตรงกัน
    3. แล้ว set ค่าใหม่ให้ carts
    4. แล้ว synCartwithProducts() ใน addToCart() ให้มัน update ข้อมูลใหม่ให้กับ carts
   */
   //  synCartwithProducts(productData) จะถูก called รัวๆที่ CardProd.jsx ตามจำนวนของ product ที่มีอยู่
   synCartwithProducts: (productData) => {
      // console.log("syncPrice And Disc", productData);
      const carts = get().carts;
      const products = get().products; //key man → fetch products from backend
      // Update all cart items with latest product data
      const updateCarts = carts.map((cartItem) => {
         //เอา p เพราะใหม่กว่า แต่เก็บ countCart ของเดิมไว้
         let latestProd = binarySearchProdId(products, cartItem.id);
         return latestProd
            ? {
                 ...latestProd,
                 countCart: cartItem.countCart,
                 buyPrice: cartItem.buyPrice,
                 buyPriceNum: cartItem.buyPriceNum,
                 preferDiscount: cartItem.preferDiscount
              }
            : cartItem;
      });

      if (productData) {
         //หา obj ใน carts ที่มี id ตรงกับ productData.id(ที่ส่งเข้ามาแต่ละชิ้น)
         let existIndex = updateCarts.findIndex((cartItem) => cartItem.id === productData?.id);
         //ถ้ามี obj ที่มี id ตรงกัน ให้เปลี่ยนค่าใน carts ที่มี id ตรงกันนั้น
         if (existIndex !== -1) {
            updateCarts[existIndex] = {
               ...productData,
               countCart: updateCarts[existIndex].countCart,
               buyPrice: productData.buyPrice,
               buyPriceNum: productData.buyPriceNum,
               preferDiscount: productData.preferDiscount
            };
         }
         //เปลี่ยนค่า carts ใน localStorage
         set({ carts: updateCarts });
         // console.log("syncPrice And Disc", productData);
         // console.log("updateCarts", updateCarts);
         // console.log("synCart with Products", carts);
      }
   },

   //clik 'Add to cart' in CardProd.jsx to call this fn▼
   //productObj = 1 prod | ==={id(productId), buyPrice, buyPriceNum, promotion, avgRating}
   //productObj จริงๆ up-to-dateอยู่แล้ว แต่แค่รอให้ call addToCart(productData) ที่ CardProd.jsx ก่อน
   addToCart: (productObj) => {
      // console.log("addToCart productObj->", productObj);
      /*list to edit ☺☺☺
      1. update productObj before add to updateCart
      2. uniqueCart should unique according to id 
      */
      const carts = get().carts; //is supposed to be updated
      //   const products = get().products;//is supposed to be updated

      //check if productObj is already in carts → select the one in carts
      // const existProd = carts.find((updatedCart) => updatedCart.id === productObj.id);
      const existProdIndex = carts.findIndex((item) => item.id === productObj.id);
      let newCarts;
      if (existProdIndex !== -1) {
         newCarts = [...carts];
         // console.log("existProdIndex", existProdIndex);
         // console.log(newCarts)
         // console.log(newCarts[existProdIndex])
         newCarts[existProdIndex] = {
            ...productObj,
            countCart: (newCarts[existProdIndex].countCart || 0) + 1 //ถ้าส่ง productObj.idมาซ้ำ ด้วยการกด 'Add to cart' === +1 ให้ countCart
         };
      } else {
         // If product doesn't exist, add new entry
         newCarts = [...carts, { ...productObj, countCart: 1 }];
      }
      set({ carts: newCarts });
      // console.log("new carts", newCarts);
      get().synCartwithProducts(productObj);
   },
   //update state wheter
   // console.log("addToCart productObj->", productObj);
   //   const updateCart = [...carts, { ...productObj, countCart: 1 }];
   //   const uniqueCart = _.uniqWith(updateCart, _.isEqual);
   //   //now carts contains only unique {obj} with uniq id:
   //   set({ carts: uniqueCart });
   //   get().synCartwithProducts(productObj); //to update carts
   // console.log("unique cart", uniqueCart);
   // console.log("cart", carts);
   // console.log('update Cart',updateCart);

   // Sync with backend on important cart operations
   // addToCart: async (productObj) => {
   //    // Update local state first for quick UI response
   //    const updatedCarts = [...get().carts, { ...productObj, countCart: 1 }];
   //    set({ carts: _.uniqWith(updatedCarts, _.isEqual) });

   //    // Then sync with backend
   //    try {
   //       await axios.post("/api/cart", {
   //          userId: get().user.id,
   //          products: updatedCarts
   //       });
   //    } catch (err) {
   //       // Handle error, maybe revert local state
   //    }
   // },
   adjustQuantity: (prodId, updateQuant) => {
      // console.log("adjustQuantity", prodId, updateQuant);
      set((state) => ({
         carts: state.carts.map((obj) =>
            obj.id === prodId
               ? //กด'+'→ ไปเอาเลข 2 มา assign ค่าให้ countCart ของ carts[obj] นั้นๆ
                 { ...obj, countCart: Math.max(1, updateQuant) }
               : obj
         )
      }));
   },
   removeCart: (prodId) => {
      //remain every product except the one with id === prodId
      set((state) => ({
         carts: state.carts.filter((obj) => obj.id !== prodId)
      }));
      console.log("removeCart", prodId);
   },
   toTalPrice: () => {
      let total = get().carts.reduce((acc, curr) => acc + curr.buyPriceNum * curr.countCart, 0);
      // console.log("total", total);
      return total;
   },
   actionLogin: async (form) => {
      //1. Send req with form to backend, path : http://localhost:5000/api/login
      const res = await axios.post(`${apiUrl}/api/login`, form);

      //2. เอา res.data ต่างๆ มา setState ให้ ecomStore().user และ ecomStore().token
      set({
         user: res.data.payload,
         token: res.data.token
      });
      /*
      res.data.payload === {id: 4, email: 'tinnapat_s@kkumail.com', role: 'user'}
      */
      //res ใช้รับสิ่งที่ส่ง(res) มาจาก backend
      return res;
   },
   //dropdown category
   getCategory: async () => {
      try {
         const res = await listCategory();
         set({ categories: res.data }); //เก็บ res.data►[{},{},..] ที่ส่งมาจาก backend  res.send()
         return res;
      } catch (err) {
         console.log(err);
         return undefined;
      }
   },
   //product in table
   getProduct: async (count = 100) => {
      try {
         const res = await listProduct(count);
         // console.log("getProduct response:", res.data);
         set({ products: res.data }); //เก็บ res.data►[{},{},..] ที่ส่งมาจาก backend
         get().syncCartsWithProducts(); // Auto-sync carts after products update
         return res; // Return the response
      } catch (err) {
         console.log(err);
         return undefined; // Return undefined in case of error
      }
   },

   getSeachFilterProd: async (filter) => {
      try {
         const res = await seachFilterProd(filter);
         // console.log("getSeachFilterProd response:", res.data);
         set({ products: res.data }); //เก็บ res.data►[{},{},..] ที่ส่งมาจาก backend  res.send()
         return res; // Return response for checking results length
      } catch (err) {
         console.log(err);
         return { data: [] }; // Return empty array if error
      }
   }
});

//ตัวแปรมาเพื่อที่จะใช้ ecomStore()
//persist(ecomStore, usePersist) ใช้เก็บข้อมูล state ที่ user กรอกลง inout ไว้ใน localStorage | ดูใน F12 webpage ► Application ► Local Storage ► ecom-store
const usePersist = {
   name: "ecom-store",
   storage: createJSONStorage(() => localStorage) //เก็บข้อมูลที่ ไว้ใน localStorage → refresh ไม่ได้ → เข้า Inspect ► Application ► Delete key "ecom-store" ออกจึงจะ refresh ค่าให้
};
// const useEcomStore = create(ecomStore);
const useEcomStore = create(persist(ecomStore, usePersist)); //useEcomStore เป็น hook

export default useEcomStore; //useEcomStore(() => {return..}) to access global state 'ecomStore'

/*
เมื่อคุณใช้ useEcomStore hook เพื่อเข้าถึง property ใน ecomStore คุณจะต้องเรียกใช้ผ่าน callback เท่านั้น
สาเหตุหลักคือ ecomStore เป็น store ที่ใช้ Zustand ซึ่งเป็น state management library 
ที่ใช้ callback เพื่อเข้าถึง state
เมื่อคุณใช้ useEcomStore hook คุณจะได้รับ callback ที่สามารถเข้าถึง property ใน ecomStore ได้ 
แต่คุณไม่สามารถเข้าถึง property ได้โดยตรง

ตัวอย่างเช่น:

const user = useEcomStore((state) => state.user);

ในตัวอย่างข้างต้น useEcomStore hook จะส่ง callback 
ที่สามารถเข้าถึง property user ใน ecomStore ได้ แต่คุณไม่สามารถเข้าถึง property user ได้โดยตรง
*/
