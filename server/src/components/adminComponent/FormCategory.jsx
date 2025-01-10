//for building category form ►►► to import to Category.jsx ('/admin/category')
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createCategory, removeCategory } from "../../api/CategoryAuth";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const FormCategory = () => {
   const token = useEcomStore((state) => state.token);

   const [name, setName] = useState("");

   //เก็บ res ที่ส่งมาจาก backend เมื่อเรียกใช้ฟังก์ชัน listCategory(token)
   //    const [categories, setCategories] = useState([]);

   //ถ้าโหลด<FormCategory /> ที่Category.jsx จะทําการเรียกใช้ฟังก์ชัน getCategory() อัตโนมัติ
   const categories = useEcomStore((state) => state.categories);
   const getCategory = useEcomStore((state) => state.getCategory);
   console.log(categories);

   /*
   useEffect(() => {
      async function getCategoryData() {
         const result = await getCategory(token);
         console.log('category->', result);
      }
      getCategoryData();
   }, [token, getCategory]);
   */
   useEffect(() => {
      getCategory(token).then((result) => {
         console.log("category->", result);
      });
   }, [token, getCategory]);
   
   //add single category Btn 
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!name || name.trim() === "") return toast.warning("Please enter category name.");

      try {
         //เอา name(string ธรรมดา) มาครอบ {..} ► ได้ { name: <string value> }
         //ระวัง: ถ้าส่งตรงนี้ไป จะได้ไปสร้างข้อมูลใน DB
         const res = await createCategory(token, { name });
         console.log(res.data.name);
         toast.success(`Add Category: ${res.data.name} Success.`);
         getCategory(token); //to update the list
         setName(""); //to empty the input text after click 'Add Category' btn
         //  e.target.reset();//to empty the input text after click 'Add Category' btn
      } catch (err) {
         console.log(err);
      }
   };

   //remove single category Btn
   const handleRemove = async (id, name) => {
      console.log(id);
      try {
         const res = await removeCategory(token, id);
         toast.success(`Remove Category: ${name} Success.`);
         getCategory(token);
         console.log(res);
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <div className='container mx-auto p-4 bg-Dropdown-option-night shadow-md rounded-md'>
         <h1>Category Management</h1>
         <form
            onSubmit={handleSubmit}
            action=''
            className='my-4'
         >
            <input
               //เปลี่ยนค่า name state ตามตัวอักษรที่พิมพ์ใน input
               onChange={(e) => setName(e.target.value)}
               value={name} //เพื่อทำให้ text หายไปหลังกด Add category
               type='text'
               placeholder='Enter a category name'
               className='border'
            />
            <button className='bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded shadow-md'>
               Add Category
            </button>
         </form>
         <ul className='list-none'>
            {categories.map((item) => (
               <li
                  key={item.id}
                  className='flex justify-between my-1 text-Text-white  hover:bg-gray-400 hover:font-semibold'
               >
                  id:{item.id} {item.name}
                  <button
                     onClick={() => handleRemove(item.id, item.name)}
                     className='text-Text-white hover:text-rose-700'
                  >
                     <Trash2 className='w-4 ' />
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
};

FormCategory.propTypes = {};

export default FormCategory;
