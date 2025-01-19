//ใช้แทน Redux ในการสร้าง Global State ► เรียกใช้งานได้ทั่วทั้ง workspace
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; //ใช้เก็บข้อมูลที่ user กรอกลง inout ไว้ใน localStorage
import { listCategory } from "../api/CategoryAuth.jsx";
import { listProduct,seachFilterProd } from "../api/ProductAuth.jsx";

const ecomStore = (set) => ({
   user: null, //ตั้งค่า null ไว้รอ res.data ก่อน
   token: null,
   categories: [],
   products: [],
   productUpdated: false,// for ImgProdInTableList + TableListProducts re-render
   setProductUpdated: (updated) => {
      set({ productUpdated: updated });
   },

   actionLogin: async (form) => {
      //1. Send req with form to backend, path : http://localhost:5000/api/login
      const res = await axios.post("http://localhost:5000/api/login", form);

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
   getProduct: async (count=50) => {
      try {
         const res = await listProduct(count);
         console.log("getProduct response:", res.data);
         set({ products: res.data }); //เก็บ res.data►[{},{},..] ที่ส่งมาจาก backend
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
   },
});

//ตัวแปรมาเพื่อที่จะใช้ ecomStore()
//persist(ecomStore, usePersist) ใช้เก็บข้อมูล state ที่ user กรอกลง inout ไว้ใน localStorage | ดูใน F12 webpage ► Application ► Local Storage ► ecom-store
const usePersist = {
   name: "ecom-store",
   storage: createJSONStorage(() => localStorage)
};
// const useEcomStore = create(ecomStore);
const useEcomStore = create(persist(ecomStore, usePersist)); //useEcomStore เป็น hook

export default useEcomStore;//useEcomStore(() => {return..}) to access global state 'ecomStore'

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
