//ติดต่อ backend

import axios from "axios";

//backend res.send()
export const createProduct = async (token, form) => {
   console.log("form to create prod", form);
   return await axios.post("http://localhost:5000/api/product", form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

//backend res.send()
//count = 20 → LIMIT = 20
export const listProduct = async (count = 50) => {
   return await axios.get("http://localhost:5000/api/products/" + count);
};

//for EditProd.jsx → FormEditProd.jsx
//backend res.json()
export const readProduct = async (id) => {
   return await axios.get("http://localhost:5000/api/product/" + id);
};

//backend res.json()
export const updateProduct = async (token, id, form) => {
   return await axios.patch("http://localhost:5000/api/product/" + id, form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

//backend res.json()
export const delProduct = async (token, id) => {
   return await axios.delete("http://localhost:5000/api/product/" + id, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

//accroding to Frontend, uploadFiles() is called before createProduct()
//backend res.json()
export const uploadFiles = async (token, form) => {
   // console.log('form api frontend',form);
   return await axios.post(
      "http://localhost:5000/api/images",
      {
         image: form
      },
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};

//backend res.json()
export const delImg = async (token, public_id) => {
   return await axios.post(
      "http://localhost:5000/api/removeimage",
      {
         public_id
      },
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};

//backend res.json()
export const bulkDiscount = async (token, form) => {
   return await axios.post("http://localhost:5000/api/bulk-discount", form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
//  const response = await fetch("/api/bulk-discount", {
//     method: "POST",
//     headers: {
//        "Content-Type": "application/json"
//     },
//     body: JSON.stringify(discountData)
//  });

//backend res.send()
export const seachFilterProd = async (filter) => {
   return await axios.post("http://localhost:5000/api/search/filters", filter);
};