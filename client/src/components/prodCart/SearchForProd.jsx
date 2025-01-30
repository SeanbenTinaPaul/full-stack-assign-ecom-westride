//parent → Shop.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

//Global state
import useEcomStore from "@/store/ecom-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { formatNumber } from "@/utilities/formatNumber";
//---------------------------------------------------------------------------
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
   const [priceRange, setPriceRange] = useState([0, 50000]); // for price range slider
   const [resetKey, setResetKey] = useState(0); //to reset key of <Slider/> in order to force Slider re-render, then reset the range bar
   const [searchTerms, setSearchTerms] = useState(seachBody);
   //console.log(textSearch);
   useEffect(() => {
      getCategory();
      getProduct(100);
   }, []);
   //1. search by text
   //req.body → { "query": "core" }
   const handleSearchText = (e) => {
      e.preventDefault();
      const txt = e.target.value;
      setTextSearch(txt); // use to assign to value={} of <input/>
      setWhatTextSearch(txt.trim());
      // console.log(txt.trim());

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
      // console.log(cateId);

      if (isChecked) {
         updateCate = [...selectedCate, cateId];
         //not use {...prev, "category": selectedCate} bc selectedCate will be updated nxet render
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

   const handlePriceChange = (values) => {
      // console.log(values);
      setPriceRange(values);
      setSearchTerms((prev) => ({ ...prev, price: values }));
   };

   //4. req to backend
   const handleSumitSearchText = async (e) => {
      e.preventDefault();
      console.log(searchTerms);
      try {
         //if not search input → just display all products
         //empty str is false, empty arr is true
         if (!searchTerms.query && searchTerms.category.length === 0) {
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

   //reset search to default
   const handleReset = async () => {
      // Reset all form states
      setTextSearch("");
      setSelectedCate([]);
      setSearchTerms({
         query: "",
         category: [],
         price: []
      });
      setWhatTextSearch("");
      setPriceRange([0, 50000]);
      setResetKey((prev) => prev + 1); // Increment key to force re-render

      // Reset search results by fetching all products
      try {
         await getProduct(100);
         setIsFoundTextSearch(false);
      } catch (err) {
         console.error("Reset error:", err);
      }
   };

   return (
      <div>
         <h1 className='text-xl font-normal mb-4'>Search product</h1>
         <form
            onSubmit={(e) => handleSumitSearchText(e)}
            className='flex flex-col gap-2'
         >
            <input
               type='text'
               value={textSearch}
               onChange={(e) => handleSearchText(e)}
               placeholder='e.g. รองเท้าเด็ก, core i7'
               className='w-full overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
            />
            <div>
               {/* {console.log('categories search',categories)} */}
               <h1>Category</h1>
               <div>
                  {categories.map((obj) => (
                     <div
                        key={obj.id}
                        className='flex gap-2 items-center'
                     >
                        {/* <input
                           type='checkbox'
                           value={obj.id}
                           checked={selectedCate.includes(obj.id)}
                           onChange={(e) => handleCheckCate(e)}
                        /> */}
                        <Checkbox
                           className='w-4 h-4 bg-white border border-gray-300 rounded-sm'
                           id={`category-${obj.id}`}
                           checked={selectedCate.includes(obj.id)}
                           onCheckedChange={(checked) => {
                              handleCheckCate({
                                 target: {
                                    value: obj.id,
                                    checked: checked
                                 }
                              });
                           }}
                        />
                        <label>{obj.name}</label>
                     </div>
                  ))}
               </div>
            </div>
            <div>
               {/* Price range */}
               <h1>Price</h1>
               <div>
                  <div className='flex justify-between '>
                     <span className='text-xs'>{formatNumber(priceRange[0])}</span>
                     <span className='text-xs'>{formatNumber(priceRange[1])}</span>
                  </div>
                  <Slider
                     key={resetKey}
                     range //e.target.value is []
                     min={0}
                     max={100000}
                     step={100}
                     defaultValue={priceRange}
                     onChange={handlePriceChange}
                     className='w-full mt-2 bg-f'
                     // Add trackStyle and handleStyle props
                     trackStyle={{ backgroundColor: "#701a75" }} // Purple color for the track
                     railStyle={{ backgroundColor: "transparent" }} // Gray color for the rail
                     handleStyle={[
                        // Style for the handles
                        {
                           backgroundColor: "#701a75",
                           borderColor: "#9ca3af"
                        },
                        {
                           backgroundColor: "#701a75",
                           borderColor: "#9ca3af"
                        }
                     ]}
                  />
               </div>
            </div>
            <Button
               type='submit'
               className='hover:bg-slate-500'
            >
               Search
            </Button>
            <Button
               variant='secondary'
               type='button'
               onClick={handleReset}
            >
               Reset
            </Button>
         </form>
         <hr />
      </div>
   );
}

SearchForProd.propTypes = {
   setIsFoundTextSearch: PropTypes.func,
   setWhatTextSearch: PropTypes.func,
   isFoundTextSearch: PropTypes.bool
};

export default SearchForProd;
