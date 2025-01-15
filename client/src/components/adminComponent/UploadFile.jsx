//parent→ FormProduct.jsx, FormEditProd.jsx
import React, { useState, createRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
//icons
import IconX from "../../utilities/IconX";
import { HardDriveDownload, ImageDown, AlertCircle } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from "@/components/ui/alert-dialog";
//API
import { delImg, uploadFiles } from "../../api/ProductAuth";
//Global state
import useEcomStore from "../../store/ecom-store";
//use for making text color auto-contrast
import { calculateTextColor } from "../../utilities/useContrastText";

function UploadFile({ inputForm, setInputForm }) {
   const token = useEcomStore((state) => state.token);
   const [isLoading, setIsLoading] = useState(false);
   const [bgColors, setBgColors] = useState({}); // Store text color for each image
   const fileInputRef = createRef(); // Create a ref for the file input
   // const [selectedFiles, setSelectedFiles] = useState([]); // State to keep track of selected files
   const [alert, setAlert] = useState(null); //for alert Warning!
   const { toast } = useToast();
   const [imageCount, setImageCount] = useState(inputForm.images.length); // Add state for image count
   // imgDataArr used to save image-data obj → both existing and new ► from cloud ONLY
   let imgDataArr = inputForm.images; //images → empty array
   // console.log("inputForm before img upload->", inputForm);
   // console.log("imgDataArr->", imgDataArr);

   const handleOnChange = (e) => {
      console.log("inputForm after img upload->", inputForm);
      //fileList ref to fileInputRef.current.value, which is somehow assigned to ""
      const fileList = e.target.files;
      // setIsLoading(true);
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
      //check if there is existing images
      // let existImg = [];

      //after user click select some images → fileList === true
      if (fileList) {
         console.log("fileList come->", fileList);
         console.log("fileList len come->", fileList.length);
         setIsLoading(true);
         let successCount = 0; // Count the number of successful uploads

         // Update file input display immediately with total images
         const existingImagesCount = inputForm.images.length;
         const newImagesCount = fileList.length;
         let totalImages = existingImagesCount + newImagesCount;
         setImageCount(totalImages);

         // if (fileInputRef.current) {
         //    fileInputRef.current.value = ""; // Reset first
         //    fileInputRef.current.value = `${totalImages} image(s)`;
         // }

         // loop to upload each image
         for (let i = 0; i < fileList.length; i++) {
            console.log(`fileList[${i}]->`, fileList[i]);
            //validate if it is image → type: "image/jpeg" , "image/png"
            if (!fileList[i].type.startsWith("image/")) {
               setIsLoading(false);
               setAlert(
                  <Alert variant='destructive'>
                     <AlertCircle className='h-4 w-4' />
                     <AlertTitle>Warning!</AlertTitle>
                     <AlertDescription>
                        `{fileList[i].name.slice(0, 10)}..{fileList[i].name.slice(-7)} is NOT image
                        file`
                     </AlertDescription>
                  </Alert>
               );
               //reset file name in input if NOT image
               fileInputRef.current.value = "";

               //update image count
               totalImages--;
               setImageCount(totalImages);

               //hide this alert after 3 seconds
               setTimeout(() => {
                  setAlert(null);
               }, 4000);
               continue; //skip Resizer.imageFileResizer()
               // toast.error(`${fileList[i].name} is not image file`);
            }

            //// for image files section ////

            //if img name already exist → skip upload
            // if (existImg.includes(fileList[i].name)) {
            //    continue; //skip upload
            // } else {
            //    existImg.push(fileList[i].name);
            // }

            setIsLoading(true);

            //Image Resize and upload
            Resizer.imageFileResizer(
               fileList[i],
               720,
               720,
               "JPEG",
               100,
               0,
               (binaryImg) => {
                  // data === base64 of image
                  //ProductAuth.jsx → backend → cloudinary (not db yet)
                  uploadFiles(token, binaryImg)
                     .then((res) => {
                        // console.log('chaeck res.data',res.data);
                        /* 
                        res.data === {success: true,
                                 message: "Upload success",
                                 data: {asset_id:"4a1b",...}
                                 } 
                         */

                        /*** ให้ทำ ถ้า res.data.data.etag เจอใน imgDataArr[i].etag
                       → call delImg(token, public_id)
                       */
                        if (imgDataArr.length > 0) {
                           for (let i = 0; i < imgDataArr.length; i++) {
                              if (imgDataArr[i].etag === res.data.data.etag) {
                                 //ลบตัวเก่า เก็บตัวใหม่
                                 delImg(token, imgDataArr[i].public_id);
                                 //ลบตัวเก่าออกจาก imgDataArr ก่อน push ตัวใหม่
                                 imgDataArr.splice(i, 1);
                                 toast({
                                    title: "Found Duplicate Images!",
                                    description: `We can keep the latest image only.`
                                 })

                                 //update image count
                                 totalImages--;
                              }
                           }
                           //update image count
                           setImageCount(totalImages);
                        }

                        console.log('imgDataArr->', imgDataArr);
                        imgDataArr.push(res.data.data);
                        setInputForm({
                           ...inputForm,
                           images: imgDataArr
                        });
                        console.log('imgDataArr-++>', imgDataArr);
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
            toast({
               title: "Upload Images Success!",
               description: `uploaded: ${successCount} image(s)`
            });

            if (fileList.length === 0) {
               fileInputRef.current.value = ""; // Reset the file input value
               setIsLoading(false); //if user click 'Choose file' but click 'Cancel' img selected → no animation
            }
            // setIsLoading(false);
            // Reset file input after successful upload
            if (fileInputRef.current) fileInputRef.current.value = "";
            // toast.success(`Upload ${successCount} images success!!!`);
         }
      }
   };

   //click 'Choose file'
   // const handleButtonClick = () => {
   //    fileInputRef.current?.click();
   // };

   //del img in cloudinary + preview, when click 'x'
   //ProductAuth.jsx → backend → cloudinary
   const handleDelImg = (public_id) => {
      delImg(token, public_id)
         .then((res) => {
            console.log("res del img in cloud", res);
            //filteredImg → remaining images
            const filteredImg = imgDataArr.filter((obj) => {
               return obj.public_id !== public_id;
            });
            console.log(filteredImg);
            // Update inputForm with remaining images
            setInputForm({
               ...inputForm,
               images: filteredImg
            });
            // Update image count after deletion
            setImageCount(filteredImg.length);
            // Always reset file input after deletion
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }

            // // Update selectedFiles state to match remaining images
            // setSelectedFiles((prev) => {
            //    const updatedFiles = [...prev];
            //    // Remove one file from selectedFiles
            //    updatedFiles.pop();
            //    return updatedFiles;
            // });
            /// Reset file input if no images left

            console.log("filteredImg.length->", filteredImg.length);
            // If no images remain, ensure everything is reset
            if (filteredImg.length === 0) {
               setImageCount(0);
            }

            // Update file input display after deletion
            // if (fileInputRef.current) {
            //    fileInputRef.current.value = ""; // Reset first
            //    fileInputRef.current.value = `${filteredImg.length} image(s)`;
            // }
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
            {/* error not picture type */}
            {alert && <div className='mb-4'>{alert}</div>}
            {/* animate during upload */}
            {isLoading && (
               <div className='w-40 text-slate-900 drop-shadow-sm flex items-center justify-center'>
                  <ImageDown className='size-8 animate-bounceScale' />
               </div>
            )}
            {/* display selected(uploaded) images */}
            {/*access url -> inputForm.images[i].data.url */}
            {console.log("inputForm.images", inputForm.images)}
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
         <div className='flex items-center gap-4'>
            <input
               type='file'
               name='images'
               ref={fileInputRef} // Attach the ref to the file input
               multiple //ให้สามารถเลือกไฟล์มากกว่า 1
               className='form-control bg-transparent block w-32 text-sm text-transparent rounded-lg file:rounded-lg '
               onChange={handleOnChange}
            />
            <span className='text-sm text-gray-500'>
               {imageCount > 0 ? `${imageCount} image(s)` : "No images selected"}
            </span>
            {/* <button
               onClick={handleButtonClick}
               className='px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            >
               Choose Files
            </button>
            <span className='text-sm text-gray-500'>
               {selectedFiles.length === 0
                  ? "No file chosen"
                  : selectedFiles.length === 1
                  ? selectedFiles[0].name
                  : `${selectedFiles.length} images selected`}
            </span> */}
         </div>
      </div>
   );
}

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
