//ติดต่อ backend

import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

//backend res.send()
export const createProduct = async (token, form) => {
   console.log("form to create prod", form);
   return await axios.post(`${apiUrl}/api/product`, form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

//backend res.send()
//count = 20 → LIMIT = 20
export const listProduct = async (count = 50, leastStock) => {
   return await axios.post(`${apiUrl}/api/products/${count}`, { leastStock });
};

//for EditProd.jsx → FormEditProd.jsx
//backend res.json()
export const readProduct = async (id) => {
   return await axios.get(`${apiUrl}/api/product/${id}`);
};

//backend res.json()
export const updateProduct = async (token, id, form) => {
   return await axios.patch(`${apiUrl}/api/product/${id}`, form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

//backend res.json()
export const delProduct = async (token, id) => {
   return await axios.delete(`${apiUrl}/api/product/${id}`, {
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
      `${apiUrl}/api/images`,
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
      `${apiUrl}/api/removeimage`,
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
   return await axios.post(`${apiUrl}/api/bulk-discount`, form, {
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
   return await axios.post(`${apiUrl}/api/search-filters`, filter);
};

export const displayProdBy = async (sort = "sold", order = "desc", limit = 5) => {
   return await axios.post(`${apiUrl}/api/display-prod-by`, { sort, order, limit });
};
export const displayProdByUser = async (token) => {
   return await axios.get(`${apiUrl}/api/display-prod-by-user`, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
export const getImgFromCloud = async (folderName) => {
   return await axios.post(`${apiUrl}/api/get-folder-images`, {
      folderName,
      // maxResults,
      // sortBy,
      // order
   });
};

