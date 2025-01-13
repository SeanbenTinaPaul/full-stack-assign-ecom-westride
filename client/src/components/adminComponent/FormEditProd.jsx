//parent→ EditProd.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; //to get id from url | to redirect
import { toast } from "react-toastify";

//Global state
import useEcomStore from "../../store/ecom-store";
//API
import { createProduct, readProduct, listProduct, updateProduct } from "../../api/ProductAuth";
//Component
import UploadFile from "./UploadFile";

const inputProd = {
   title: "",
   description: "",
   price: "",
   quantity: "",
   categoryId: "",
   images: [] //save url of images from Cloudinary→ [{url:..},{url:..}]
};

function FormEditProd() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { token, getCategory, categories } = useEcomStore((state) => state);
   const [inputForm, setInputForm] = useState(inputProd);
   const [loading, setLoading] = useState(false);
   //  console.log('inputForm bf edit->', inputForm);

   useEffect(() => {
      const fetchProduct = async (token, id, inputForm) => {
         try {
            const res = await readProduct(token, id, inputForm);
            console.log("res edit prod->", res.data);
            // res.data = { data: res.data.data };//remove 'success: true' key from {}
            setInputForm(res.data.data); //ทำให้เติม value ในช่อง form by default เมื่อเข้ามาในหน้านี้
         } catch (err) {
            console.log(err);
         }
      };
      getCategory(token);//for dropdown select Category
      fetchProduct(token, id, inputForm);
   }, [token, getCategory, id]);
   console.log("inputForm edit prod->", inputForm);

   //listen to keyboard event on input box(not on button) and update inputForm
   const handleOnchange = (e) => {
      console.log(e.target.name, e.target.value);
      setInputForm({
         ...inputForm,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("inputForm->", inputForm);

      //if user did not select category and click 'update Product' ► won't let to submit, using return to stop
      for (let key in inputForm) {
         if (!inputForm[key] || inputForm[key] === "") {
            if (key === "description" || key === "sold" || key === "images") continue; //empty description can be allowed
            if (key === "categoryId") {
               return toast.warning("Please select category.");
            } else {
               return toast.warning("Please enter all fields.");
            }
         }
      }

      try {
         setLoading(true);
         const res = await updateProduct(token, id, inputForm);
         toast.success(`Update Product: ${res.data.data.title} Success.`);
         setTimeout(() => {
            navigate("/admin/product"); //after click 'update Product' → sredirect to '/admin/product'
         }, 200);
         // setTimeout(() => {
         //    window.location.reload();
         // }, 1000); //"/admin/product" page will be reloaded after 1 sec
         setLoading(false);
      } catch (err) {
         console.log(err);
         setLoading(false);
      }
   };

   return (
      <div>
         <div className='container mx-auto p-4 gap-4 bg-Dropdown-option-night shadow-md rounded-md'>
            <form
               action=''
               onSubmit={handleSubmit}
            >
               <h1>Product Management</h1>
               <label
                  htmlFor='title'
                  className='block font-medium'
               >
                  Product Name
               </label>
               <input
                  type='text'
                  className='border my-1 rounded-md placeholder:text-gray-400'
                  name='title' //โผล่ใน event.target.name
                  value={inputForm.title} ////โผล่ใน event.target.value
                  placeholder='e.g. ขาหมูเยอรมัน, HP Laptop...'
                  onChange={handleOnchange}
               />
               <label
                  htmlFor='description'
                  className='block font-medium'
               >
                  Description
               </label>
               <input
                  type='text'
                  className='border my-1 rounded-md placeholder:text-gray-400'
                  name='description'
                  value={inputForm.description}
                  placeholder='e.g. คู่มือทำอาหาร, อุปกรณ์เครื่องใช้ไฟฟ้า...'
                  onChange={handleOnchange}
               />
               <label
                  htmlFor='price'
                  className='block font-medium'
               >
                  Price {"(฿)"}
               </label>
               <input
                  type='number'
                  step='0.01' //ให้เติมทศนิยมได้ 2 ตัว |='any'ได้ทุกตัว
                  className='border my-1 rounded-md placeholder:text-gray-400'
                  name='price'
                  value={inputForm.price}
                  placeholder='e.g. 5000, 99.50'
                  onChange={handleOnchange}
               />
               <label
                  htmlFor='quantity'
                  className='block font-medium'
               >
                  Quantity
               </label>
               <input
                  type='number'
                  className='border my-1 rounded-md placeholder:text-gray-400'
                  name='quantity'
                  value={inputForm.quantity}
                  placeholder='e.g. 150'
                  onChange={handleOnchange}
               />
               <br />
               <select
                  name='categoryId'
                  value={inputForm.categoryId}
                  id=''
                  className='border my-1 rounded-md'
                  onChange={handleOnchange}
                  required
               >
                  <option
                     value={""}
                     disabled
                  >
                     Select category
                  </option>
                  {categories.map((item, i) => (
                     <option
                        key={i}
                        value={item.id}
                     >
                        {item.name}
                     </option>
                  ))}
               </select>

               <div></div>
               {/* upload img file */}
               <UploadFile
                  inputForm={inputForm}
                  setInputForm={setInputForm}
               />
               <button
                  className='bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-md shadow-md'
                  disabled={loading}
               >
                  {loading ? "Updating..." : "Update Product"}
               </button>
            </form>
         </div>
      </div>
   );
}
//UploadFile is called first, then FormProduct
export default FormEditProd;
