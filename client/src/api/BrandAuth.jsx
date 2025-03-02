import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createBrand = async (token, form) => {
   return await axios.post(`${apiUrl}/api/brand`, form, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

export const updateBrand = async (token, form) => {
    return await axios.patch(`${apiUrl}/api/brand`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const listBrand = async () => {
   return await axios.get(`${apiUrl}/api/brand`);
};

export const removeBrand = async (token,id) => {
    return await axios.delete(`${apiUrl}/api/brand/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }