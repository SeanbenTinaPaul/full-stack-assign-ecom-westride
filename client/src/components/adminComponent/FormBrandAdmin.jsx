//parent → Brand.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

import {
   Package,
   PackagePlus,
   FileText,
   DollarSign,
   Package2,
   FolderOpen,
   Image,
   Trash2,
   AlertCircle,
   Terminal,
   Pencil,
   Slack
} from "lucide-react";

import useEcomStore from "@/store/ecom-store";
import { createBrand, removeBrand, updateBrand } from "@/api/BrandAuth";
import UploadPersonPic from "../userComponent/UploadPersonPic";

function FormBrandAdmin(props) {
   const { token, getBrand, brands } = useEcomStore((state) => state);

   const [brandForm, setBrandForm] = useState({});
   const { toast } = useToast();
   const [alert, setAlert] = useState(null); //for alert Warning!
   const [showDialog, setShowDialog] = useState(false); //for alert Confirm
   const [showDialogRm, setShowDialogRm] = useState(false); //for alert Confirm
   const [isEdit, setIsEdit] = useState(false);
   const [cancelImg, setCancelImg] = useState(false);
   const [brandToRm, setBrandToRm] = useState({});

   useEffect(() => {
      getBrand(token);
   }, [token, getBrand, setBrandForm, brandForm, setCancelImg, cancelImg]);

   const handleEdit = (id, title, description, img_url, public_id) => {
      console.log("id->", id, title);
      console.log("brands->", brands);
      setIsEdit(true);
      // setBrandForm({});
      setBrandForm((prev) => ({
         ...prev,
         id: id,
         title: title,
         description: description,
         image: img_url,
         image_url: img_url,
         public_id: public_id
      }));
      //auto scroll to top when click edit
      setTimeout(() => {
         window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      // document.body.scrollIntoView({ behavior: 'smooth' });
   };
   const handleOnchange = (e) => {
      // console.log("e.target.name->", e.target.name);
      setBrandForm({
         ...brandForm,
         [e.target.name]: e.target.value
      });
   };

   const handleAddBrand = async (e) => {
      try {
         e.preventDefault();
         if (!brandForm?.title || brandForm?.title.trim() === "") {
            setAlert(
               <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Warning!</AlertTitle>
                  <AlertDescription>Brand name is required</AlertDescription>
               </Alert>
            );
            //hide this alert after 3 seconds
            setTimeout(() => {
               setAlert(null);
            }, 4000);
            return;
         }
         console.log("brandForm->", brandForm);
         const res = await createBrand(token, brandForm);
         console.log("res create brand->", res);
         toast({
            title: "You've added a brand!",
            description: `ID: ${res.data.id} Brand: ${res.data.title}`
         });
         setBrandForm((prev) => ({
            ...prev,
            title: "",
            description: "",
            image: "",
            public_id: "",
            id: "",
            previousImgId: "",
            image_url: ""
         }));
      } catch (err) {
         console.error(err);
         toast({
            variant: "destructive",
            title: "Failed to add brand",
            description: "Try again later."
         });
      }
   };

   //----------- Update a brand ------------
   const handleUpdate = () => {
      setShowDialog(true);
   };
   const confirmUpdate = async () => {
      console.log("brandForm->", brandForm);

      try {
         const res = await updateBrand(token, brandForm);
         if (res.status === 200) {
            toast({
               title: "You've updated a brand!",
               description: `ID: ${res.data.id} Brand: ${res.data.title}`
            });
            setIsEdit(false);
            setBrandForm((prev) => ({
               ...prev,
               title: "",
               description: "",
               image: "",
               public_id: "",
               id: "",
               previousImgId: "",
               image_url: ""
            }));
         }
         // setCancelImg(true); // Trigger cleanup in UploadPersonPic.jsx
      } catch (err) {
         console.log(err);
      }
   };

   //----------- Rm a brand ------------
   const handleRemove = (id, brandTitle) => {
      //bring id and name of category.item when click <Trash2 />
      setBrandToRm({ ...brandToRm, id, title: brandTitle });
      setShowDialogRm(true);
      //true to ONLY show dialog
      //Click 'Cancel' → setShowDialog(false);
      //Click 'Continue' → call confirmRemove() ▼
   };
   const confirmRemove = async () => {
      try {
         console.log("brandToRm->", brandToRm);
         const res = await removeBrand(token, brandToRm.id);
         if (res.status === 200) {
            toast({
               title: "You've removed a brand!",
               description: `${res.data.message}`
            });

            setShowDialogRm(false);
            setCancelImg(true); // Trigger cleanup in UploadPersonPic.jsx
            setBrandToRm(null);
         }
      } catch (err) {
         console.log(err);
      }
   };
   //----------------------------------
   const handleCancel = (e) => {
      e.preventDefault();
      setCancelImg(true); // Trigger cleanup in UploadPersonPic.jsx
      setIsEdit(false);
      setBrandForm((prev) => ({
         ...prev,
         id: "",
         title: "",
         description: "",
         image: ""
      }));
   };

   return (
      <div>
         <div className='w-full space-y-6 max-w-3xl  '>
            {!isEdit ? (
               <Card className='w-full max-w-3xl rounded-xl bg-gradient-to-tr from-slate-50 to-card'>
                  <CardHeader>
                     <CardTitle className='flex items-center gap-2'>
                        <PackagePlus className='w-5 h-5' />
                        Brand register
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className='mb-4'>{alert}</div>
                     <form className='flex gap-4'>
                        <input
                           onChange={(e) => handleOnchange(e)}
                           value={brandForm?.title}
                           name='title'
                           type='text'
                           placeholder='Enter a brand title'
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                        />
                        <input
                           onChange={(e) => handleOnchange(e)}
                           value={brandForm?.description}
                           name='description'
                           type='text area'
                           placeholder='Enter brand description'
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                        />
                     </form>
                     <div className='w-full mt-6 border-2 border-dashed border-gray-200 rounded-xl pt-10 pb-2'>
                        <UploadPersonPic
                           inputForm={brandForm}
                           setInputForm={setBrandForm}
                           setCancelImg={setCancelImg}
                           cancelImg={cancelImg}
                           width={720}
                           height={720}
                           quality={100}
                        />
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <Card className='w-full max-w-3xl rounded-xl bg-gradient-to-tr from-slate-50 to-card'>
                  <CardHeader>
                     <CardTitle className='flex items-center gap-2'>
                        <PackagePlus className='w-5 h-5 text-amber-600' />
                        Edit Brand
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     {/* {console.log("brandForm->", brandForm)} */}
                     <div className='mb-4'>{alert}</div>
                     <form className='flex gap-4'>
                        <input
                           onChange={(e) => handleOnchange(e)}
                           value={brandForm?.title}
                           name='title'
                           type='text'
                           placeholder='Enter a brand title'
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                        />
                        <input
                           onChange={(e) => handleOnchange(e)}
                           value={brandForm?.description}
                           name='description'
                           type='text area'
                           placeholder='Enter brand description'
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                        />
                     </form>
                     <div className='w-full mt-6 border-2 border-dashed border-gray-200 rounded-xl pt-10 pb-2'>
                        <UploadPersonPic
                           inputForm={brandForm}
                           setInputForm={setBrandForm}
                           setCancelImg={setCancelImg}
                           cancelImg={cancelImg}
                           width={720}
                           height={720}
                           quality={100}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}
            <div className='flex items-center gap-2'>
               {!isEdit ? (
                  <Button
                     onClick={handleAddBrand}
                     className=' hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out'
                  >
                     Add Brand
                  </Button>
               ) : (
                  <Button
                     onClick={handleUpdate}
                     className=' hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out'
                  >
                     Update Brand
                  </Button>
               )}
               {isEdit && (
                  <Button
                     type='button'
                     variant='outline'
                     onClick={(e) => {
                        handleCancel(e);
                     }}
                     className=' rounded-xl transition-all duration-300 ease-in-out'
                  >
                     Cancel Edit
                  </Button>
               )}
            </div>
            <Card className='w-full max-w-3xl rounded-xl bg-gradient-to-tr from-slate-50 to-card'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <FileText className='w-4 h-4' />
                     Brand List
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='relative overflow-x-auto'>
                     <table className='w-full text-sm text-left'>
                        <thead className='text-xs  bg-gray-50'>
                           <tr>
                              <th className='px-6 py-3'>ID</th>
                              <th className='px-6 py-3'>Logo</th>
                              <th className='px-6 py-3'>Brand Title</th>
                              <th className='px-6 py-3'>Desription</th>
                              <th className='px-6 py-3 text-right'>Edit</th>
                           </tr>
                        </thead>
                        <tbody>
                           {brands?.map((item) => (
                              <tr
                                 key={item.id}
                                 className='bg-white border-b hover:bg-gray-50'
                              >
                                 <td className='px-6 py-4'>{item.id}</td>
                                 <td className='px-6 py-4'>
                                    <Badge
                                       className='py-0 px-0 w-8 h-5 bg-card flex items-center drop-shadow'
                                       title={item.title}
                                    >
                                       {item.img_url ? (
                                          <img
                                             src={item.img_url}
                                             alt=''
                                             className='w-full h-full rounded-md mx-auto object-center object-contain'
                                          />
                                       ) : (
                                          <Slack className='w-4 h-4 mx-auto fill-current text-slate-500 font-thin' />
                                       )}
                                    </Badge>
                                 </td>
                                 <td className='px-6 py-4'>{item.title}</td>
                                 <td className='px-6 py-4'>{item.description}</td>
                                 <td className='pl-6 py-4 flex  justify-end items-center'>
                                    <Button
                                       variant='ghost'
                                       size='icon'
                                       onClick={() =>
                                          handleEdit(
                                             item.id,
                                             item.title,
                                             item.description,
                                             item.img_url,
                                             item.public_id
                                          )
                                       }
                                       className='hover:text-amber-500 hover:scale-125 transition-all duration-300 ease-in-out'
                                       disabled={isEdit}
                                    >
                                       <Pencil className='w-4 h-4' />
                                    </Button>
                                    <Button
                                       variant='ghost'
                                       size='icon'
                                       onClick={() => handleRemove(item.id, item.title)}
                                       className='hover:text-rose-700 hover:scale-125 transition-all duration-300 ease-in-out'
                                       disabled={isEdit}
                                    >
                                       <Trash2 className='w-4 h-4' />
                                    </Button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <AlertDialog
                        open={showDialogRm}
                        onOpenChange={setShowDialogRm}
                     >
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                 <div>
                                    This action <strong>cannot be undone</strong>. This will{" "}
                                    <strong>permanently</strong> delete the brand and remove its{" "}
                                    <strong>related products</strong> from our servers.
                                 </div>
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel onClick={confirmRemove}>
                                 Yes, delete
                              </AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() => {
                                    setShowDialogRm(false);
                                    setBrandForm({});
                                    setIsEdit(false);
                                 }}
                              >
                                 Cancel, keep it
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                     {/*  */}
                     <AlertDialog
                        open={showDialog}
                        onOpenChange={setShowDialog}
                     >
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>Update confirmation</AlertDialogTitle>
                              <AlertDialogDescription>
                                 <div>
                                    Changing brand information might impact the look and feel of all
                                    related products. Please carefully review your changes to avoid
                                    customer confusion.{" "}
                                    <strong>Confirm update only if you're sure.</strong>
                                 </div>
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel onClick={confirmUpdate}>
                                 Yes, update
                              </AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() => {
                                    setShowDialog(false);
                                    // setIsEdit(false);
                                    // setBrandForm({});
                                 }}
                              >
                                 Back to review the changes
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}

FormBrandAdmin.propTypes = {};

export default FormBrandAdmin;
