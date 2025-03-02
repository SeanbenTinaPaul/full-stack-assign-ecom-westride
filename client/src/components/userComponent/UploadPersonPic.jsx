//parent →FormEditProfileUser.jsx
import React, { useState, createRef, useEffect } from "react";
import PropTypes from "prop-types";
import useEcomStore from "@/store/ecom-store";
import { useToast } from "@/components/hooks/use-toast";
import Resizer from "react-image-file-resizer";
import IconX from "@/utilities/IconX";
import { HardDriveDownload, ImageDown, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { delImg, uploadFiles } from "@/api/ProductAuth";
import { calculateTextColor } from "@/utilities/useContrastText";
import { use } from "react";

function UploadPersonPic({
   inputForm,
   setInputForm,
   cancelImg,
   setCancelImg,
   width = 720,
   height = 720,
   quality = 100
}) {
   const { token, user } = useEcomStore((state) => state);
   const [isLoading, setIsLoading] = useState(false);
   const [bgColors, setBgColors] = useState({}); //Store text color for each image
   const fileInputRef = createRef(); // Create a ref for the file input
   const [alert, setAlert] = useState(null); //for alert Warning!
   const { toast } = useToast();
   const [previousImgId, setPreviousImgId] = useState(null);

   const handleOnChange = (e) => {
      // console.log("inputForm before img upload->", inputForm);
      const file = e.target.files[0];
      // console.log("file->", file);
      if (!file) return;
      setIsLoading(true);
      if (!file.type.startsWith("image/")) {
         setIsLoading(false);
         setAlert(
            <Alert variant='destructive'>
               <AlertCircle className='h-4 w-4' />
               <AlertTitle>Warning!</AlertTitle>
               <AlertDescription>
                  `{file.name.slice(0, 10)}..{file.name.slice(-7)} is NOT image file`
               </AlertDescription>
            </Alert>
         );
         //reset file name in input if NOT image
         fileInputRef.current.value = "";
         //hide this alert after 3 seconds
         setTimeout(() => {
            setAlert(null);
         }, 4000);
      }

      //// for image files section ////
      setIsLoading(true);
      //Image Resize and upload | 300,480,720,900,1080,1200,1440,1920 | JPEG, PNG, WEBP
      Resizer.imageFileResizer(
         file,
         width,
         height,
         "WEBP",
         quality,
         0,
         async (binaryPic) => {
            try {
               // Del previous image if exists
               if (inputForm.image?.public_id || inputForm.public_id) {
                  console.log("Deleting previous image:", inputForm.image.public_id);
                  await delImg(token, inputForm.image?.public_id || inputForm.public_id);
               }
               const res = await uploadFiles(token, binaryPic);
               //  console.log("res upload img in cloud", res);
               setInputForm((prev) => ({
                  ...prev,
                  image: res.data.data,
                  previousImgId: res.data.data.public_id
               }));
               setPreviousImgId(res.data.data.public_id);
               setIsLoading(false);
               toast({
                  title: "Success!",
                  description: `${file.name} uploaded successfully!`
               });
            } catch (err) {
               console.log(err);
               setIsLoading(false);
               toast({
                  variant: "destructive",
                  title: "Failed to upload image",
                  description: "Failed to upload image"
               });
            } finally {
               setIsLoading(false);
            }
         },
         "base64"
      );
   };
   // useEffect(() => {
   //    console.log("previousImgId->", previousImgId);
   // }, [setPreviousImgId, previousImgId, cancelImg]);

   const handleDelImg = async (public_id) => {
      try {
         const res = await delImg(token, public_id);
         console.log("res del img in cloud", res);
         setInputForm({
            ...inputForm,
            image: "",
            public_id: ""
         });
         // Always reset file input after deletion
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      } catch (err) {
         console.log(err);
      } finally {
         setIsLoading(false);
      }
   };
   //Del all new added images in Cloudinary if user click 'Cancel'
   //and setInputForm({images: []}) but leave only existing images
   useEffect(() => {
      if (cancelImg) {
         console.log("Canceling image upload");
         const cleanup = async () => {
            try {
               // Delete newly uploaded images from cloud
               // console.log("previous image:::", previousImgId);
               // console.log("inputForm.previousImgId image:::", inputForm.previousImgId);
               if (previousImgId || inputForm.previousImgId) {
                  const res = await delImg(token, previousImgId || inputForm.previousImgId);
                  console.log("res del img in cloud", res);
                  setInputForm((prev) => ({
                     ...prev,
                     description: "",
                     title: "",
                     id: null,
                     image: "",
                     public_id: "",
                     previousImgId: null,
                     image_url: ""
                  }));
               }
               // Reset file input
               if (fileInputRef.current) {
                  fileInputRef.current.value = "";
               }
            } catch (err) {
               console.error("Error cleaning up images:", err);
               toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to clean up uploaded images"
               });
            }
         };
         cleanup();
         setCancelImg(false);
      }
   }, [cancelImg, token, inputForm?.image]);
   const handleCalculateTextColor = (imgElement, assetId) => {
      const contrastColor = calculateTextColor(imgElement);
      setBgColors((prev) => ({ ...prev, [assetId]: contrastColor }));
   };
   return (
      <div>
         <div className='flex flex-wrap gap-1 justify-center mx-2 my-3'>
            {/* error not picture type */}
            {alert && <div className='mb-4'>{alert}</div>}
            {/* animate during upload */}
            {isLoading && (
               <div className='w-40 text-slate-900 drop-shadow-sm flex items-center justify-center'>
                  <ImageDown className='size-8 animate-bounceScale' />
               </div>
            )}
            {/* display selected(uploaded) images */}
            {/* {console.log("inputForm->", inputForm)} */}
            {/* {console.log("user->", user)} */}
            {inputForm.image && (
               <div
                  key={inputForm?.image?.asset_id}
                  className='relative  hover:z-22'
               >
                  <img
                     // inputForm.image?.url if just uploaded | inputForm.image if from DB (from token)
                     src={inputForm.image?.url || inputForm?.image}
                     alt='user-img'
                     className='h-32 object-cover scale-150 rounded-full hover:rounded-lg hover:shadow-lg hover:scale-[250%] transition-all duration-500 ease-in-out'
                     crossOrigin='anonymous' // Needed for Color Thief
                     onLoad={(e) =>
                        handleCalculateTextColor(
                           e.target,
                           inputForm.image?.asset_id || inputForm.public_id
                        )
                     }
                  />
                  <span
                     title='Delete picture'
                     className={`absolute top-0 right-2 w-4 opacity-30 cursor-pointer hover:opacity-100 hover:rotate-90 hover:scale-y-125 transition duration-500`}
                     onClick={() => handleDelImg(inputForm.image?.public_id || inputForm.public_id)}
                  >
                     <IconX
                        bgColor={bgColors[inputForm.image?.asset_id]}
                        className={`${
                           bgColors[inputForm.image?.asset_id] === "black"
                              ? "text-black "
                              : "text-white"
                        } hover:text-red-600 `}
                     />
                  </span>
               </div>
            )}
         </div>
         <div className='flex justify-end items-center gap-4'>
            <input
               type='file'
               name='image'
               ref={fileInputRef} // Attach the ref to the file input
               multiple={false}
               className='form-control bg-transparent block w-32 text-sm text-transparent rounded-xl file:rounded-xl '
               onChange={handleOnChange}
            />
         </div>
      </div>
   );
}

UploadPersonPic.propTypes = {
   inputForm: PropTypes.object,
   setInputForm: PropTypes.func,
   cancelImg: PropTypes.bool,
   setCancelImg: PropTypes.func,
   width: PropTypes.number,
   height: PropTypes.number,
   quality: PropTypes.number
};

export default UploadPersonPic;
