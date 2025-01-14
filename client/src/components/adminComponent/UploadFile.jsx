//parent→ FormProduct.jsx, FormEditProd.jsx
import React, { useState, createRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
//icons
import IconX from "../../utilities/IconX";
import { HardDriveDownload,ImageDown  } from "lucide-react";
//API
import { delImg, uploadFiles } from "../../api/ProductAuth";
//Global state
import useEcomStore from "../../store/ecom-store";
//use for making text color auto-contrast
import { calculateTextColor } from "../../utilities/useContrastText";

const UploadFile = ({ inputForm, setInputForm }) => {
   const token = useEcomStore((state) => state.token);
   const [isLoading, setIsLoading] = useState(false);
   const [bgColors, setBgColors] = useState({}); // Store text color for each image
   const fileInputRef = createRef(); // Create a ref for the file input
   // const [selectedFiles, setSelectedFiles] = useState([]); // State to keep track of selected files

   // imgDataArr used to save image-data obj
   let imgDataArr = inputForm.images; //images → empty array
   // console.log("inputForm before img upload->", inputForm);
   // console.log("imgDataArr->", imgDataArr);

   const handleOnChange = (e) => {
      setIsLoading(true);
      console.log("inputForm after img upload->", inputForm);
      const fileList = e.target.files;
      // setSelectedFiles(Array.from(fileList)); // Update selected files state
      /*fileList === {
                        "0": { lastModified : 1736416405065,
	                            lastModifiedDate : Thu Jan 09 2025 16:53:25 GMT+0700 (Indochina Time),
	                            name : "1000269976_front_XXL.jpg",
	                            size : 29754,
	                            type : "image/jpeg",
	                            webkitRelativePath : ""
                              },
                        "1": {...}
                     }
      */
      //after user click 'select' for images → files === true
      if (fileList) {
         setIsLoading(true);
         let successCount = 0; // Count the number of successful uploads
         // loop to upload each image
         for (let i = 0; i < fileList.length; i++) {
            console.log(fileList[i]);
            //validate if it is image → type: "image/jpeg" , "image/png"
            if (!fileList[i].type.startsWith("image/")) {
               toast.error(`${fileList[i].name} is not image file`);
               continue; //skip Resizer.imageFileResizer()
            }
            //Image Resize
            Resizer.imageFileResizer(
               fileList[i],
               720,
               720,
               "JPEG",
               100,
               0,
               (binaryImg) => {
                  // data === base64 of image
                  //ProductAuth.jsx → backend
                  uploadFiles(token, binaryImg)
                     .then((res) => {
                        // console.log('chaeck res.data',res.data);
                        /* 
                        res.data === {success: true,
                                 message: "Upload success",
                                 data: {asset_id:"4a1b",...}
                                 } 
                        */
                        imgDataArr.push(res.data.data);
                        setInputForm({
                           ...inputForm,
                           images: imgDataArr
                        });
                        setIsLoading(false);
                     })
                     .catch((err) => {
                        console.log(err);
                        setIsLoading(false);
                     });
               },
               "base64" //encode img to base64 binary
            );
            successCount++; // Increment success count
         }
         // Show toast success message only if all uploads were successful
         if (successCount === fileList.length && successCount > 0) {
            toast.success(`Upload ${successCount} images success!!!`);
         }
         if (fileList.length === 0) fileInputRef.current.value = ""; // Reset the file input value
      }
   };

   //del img in cloudinary + preview, when click 'x'
   const handleDelImg = (public_id) => {
      delImg(token, public_id)
         .then((res) => {
            console.log("res del img in cloud", res);
            const filteredImg = imgDataArr.filter((obj) => {
               return obj.public_id !== public_id;
            });
            console.log(filteredImg);
            setInputForm({
               ...inputForm,
               images: filteredImg
            });
            // setSelectedFiles([]); // Reset selected files state
            if (filteredImg.length === 0) fileInputRef.current.value = ""; // Reset the file input value
         })
         .catch((err) => {
            console.log(err);
         });
   };

   //calculate text color - colorThief
   //contrastColor is 'black' or 'white'
   const handleCalculateTextColor = (imgElement, assetId) => {
      const contrastColor = calculateTextColor(imgElement);
      setBgColors((prev) => ({ ...prev, [assetId]: contrastColor }));
   };

   // const calculateTextColor = (imgElement, assetId) => {
   //    const colorThief = new ColorThief();
   //    const [r, g, b] = colorThief.getColor(imgElement);
   //    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
   //    const contrastColor = luminance > 128 ? "black" : "white"; // Choose contrast color
   //    setTextColors((prev) => ({ ...prev, [assetId]: contrastColor }));
   // };
   return (
      <div>
         <div className='flex flex-wrap gap-1 justify-start mx-2 my-3'>
            {/*access url -> inputForm.images[i].data.url */}
            {isLoading && (
               <div className="w-40 text-Text-white drop-shadow-sm flex items-center justify-center">
                  <ImageDown className='size-8 animate-bounceScale' />
               </div>
            )}
            {inputForm.images &&
               inputForm.images.map((obj) => {
                  return (
                     <div
                        key={obj.asset_id}
                        className='relative hover:z-22'
                     >
                        <img
                           src={obj.url}
                           alt='product-img'
                           className='h-24 hover:shadow-lg hover:scale-150 transition duration-500 ease-in-out'
                           crossOrigin='anonymous' // Needed for Color Thief
                           onLoad={(e) => handleCalculateTextColor(e.target, obj.asset_id)}
                        />
                        <span
                           title='Delete image'
                           className={`absolute top-0 right-2 w-4 opacity-30 cursor-pointer hover:opacity-100 hover:rotate-90 hover:scale-y-125 transition duration-500`}
                           onClick={() => handleDelImg(obj.public_id)}
                        >
                           <IconX
                              bgColor={bgColors[obj.asset_id]}
                              className={`${
                                 bgColors[obj.asset_id] === "black" ? "text-black " : "text-white"
                              } hover:text-red-600 `}
                           />
                        </span>
                     </div>
                  );
               })}
         </div>
         <div>
            <input
               type='file'
               name='images'
               ref={fileInputRef} // Attach the ref to the file input
               multiple //ให้สามารถเลือกไฟล์มากกว่า 1
               className='form-control rounded-md mb-2 hover:bg-slate-400 transition-colors duration-300 ease-in-out'
               onChange={handleOnChange}
            />
            {/* <div>
               {selectedFiles.length === 0
                  ? "No file chosen"
                  : selectedFiles.length === 1
                  ? selectedFiles[0].name
                  : `${selectedFiles.length} images selected`}
            </div> */}
         </div>
      </div>
   );
};

UploadFile.propTypes = {
   inputForm: PropTypes.object,
   setInputForm: PropTypes.func,
   dominantColor: PropTypes.any
};

export default UploadFile;

/*
NOTE: to fix not be able to upload the same img after del all. 
When del all, the label will NOT go back to 'No file chosen' as it should.
It still shows the last selected 'imgName.JPG' even NO MORE img selected.
------------------------------------------------------------------------
- import {createRef} from 'react'; → to use 'ref' attribute
- ref is for keeping track of the file input element
- add 'fileInputRef.current.value' to both handleDelImg and handleOnChange
- fileInputRef.current.value = "" when dataImgArr.length === 0
- add ref={fileInputRef} to <input type='file'>
*/
