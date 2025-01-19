//parent → Shop.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

//Global state
import useEcomStore from "@/store/ecom-store";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";

let seachBody = {
   query: "",
   category: [],
   price: []
};

function SearchForProd({ setIsFoundTextSearch, isFoundTextSearch, setWhatTextSearch }) {
   const { token, products, getProduct, getSeachFilterProd, getCategory, categories } =
      useEcomStore((state) => state);
   const [textSearch, setTextSearch] = useState(""); //for text search
   const [selectedCate, setSelectedCate] = useState([]); // Track selected category IDs
   const [searchTerms, setSearchTerms] = useState(seachBody);
   //console.log(textSearch);

   //1. search by text
   //req.body → { "query": "core" }
   const handleSearchText = (e) => {
      e.preventDefault();
      const txt = e.target.value;
      setTextSearch(txt);// use to assign to value={} of <input/>
      setWhatTextSearch(txt.trim());
      console.log(txt.trim());

      if (txt.trim()) {
         setSearchTerms((prev) => ({ ...prev, query: txt.trim() }));
      } else {
         setSearchTerms((prev) => ({ ...prev, query: "" }));
         setWhatTextSearch("");
      }
   };

   //2. search by category
   //req.body → { "category": [1, 2] }
   const handleCheckCate = (e) => {
      const cateId = parseInt(e.target.value); //value='' of <input/>
      const isChecked = e.target.checked; //true or false
      let updateCate = []; //reset every click at checkbox
      console.log(cateId);

      if (isChecked) {
         updateCate = [...selectedCate, cateId];
         //not use "category": selectedCate bc it will be updated nxet render
         setSearchTerms((prev) => ({ ...prev, category: updateCate }));
      } else {
         //ถ้า unchecked → เอาเลข id นั้นมา filter ออกจาก [] ที่ใช้เก็บเลข id ตั้งแต่ render รอบก่อน
         updateCate = selectedCate.filter((id) => id !== cateId);
         setSearchTerms((prev) => ({ ...prev, category: updateCate }));
      }
      //to decide if display a symbol cheked or unchecked
      setSelectedCate(updateCate);
   };

   //3. search by price
   //req.body → { "price": [100, 600] }

   //4. req to backend
   const handleSumitSearchText = async (e) => {
      e.preventDefault();
      console.log(searchTerms);
      try {
         //if not search input → just display all products
         //empty str is false, empty arr is true
         if(!searchTerms.query && searchTerms.category.length === 0) {
            getProduct(100);
            setIsFoundTextSearch(true);
         }

         const result = await getSeachFilterProd(searchTerms);
         //check if prod were found
         if (result?.data?.length === 0) {
            //not found but display all prod instead
            setIsFoundTextSearch(false);
            getProduct(100);
         } else {
            //found
            setIsFoundTextSearch(true);
         }
      } catch (err) {
         console.error("Search error:", err);
         setIsFoundTextSearch(false);
      }
   };

   return (
      <div>
         <h1 className='text-xl font-semibold mb-4'>Search product</h1>
         <form
            onSubmit={(e) => handleSumitSearchText(e)}
            className='flex flex-col gap-2'
         >
            <input
               type='text'
               value={textSearch}
               onChange={(e) => handleSearchText(e)}
               placeholder='e.g. รองเท้าเด็ก, core i7'
               className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
            />
            <div>
               <h1>Category</h1>
               <div>
                  {categories.map((obj) => (
                     <div
                        key={obj.id}
                        className='flex gap-2'
                     >
                        <input
                           type='checkbox'
                           value={obj.id}
                           checked={selectedCate.includes(obj.id)}
                           onChange={(e) => handleCheckCate(e)}
                        />
                        <label>{obj.name}</label>
                     </div>
                  ))}
               </div>
            </div>
            <Button type='submit'>Search</Button>
         </form>
         <hr />
      </div>
   );
}

SearchForProd.propTypes = {
   setIsFoundTextSearch: PropTypes.func,
   setWhatTextSearch: PropTypes.func,
   isFoundTextSearch: PropTypes.bool,

};

export default SearchForProd;
