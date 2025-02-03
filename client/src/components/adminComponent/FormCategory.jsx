//for building category form ►►► to import to CategoryAdmin.jsx ('/admin/category')
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//component UI
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
//api
import { createCategory, removeCategory } from "../../api/CategoryAuth";
//Global state
import useEcomStore from "../../store/ecom-store";
//toast
// import { toast } from "react-toastify";
//icons
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
   Terminal
} from "lucide-react";

function FormCategory() {
   const token = useEcomStore((state) => state.token);

   const [name, setName] = useState("");

   //เก็บ res ที่ส่งมาจาก backend เมื่อเรียกใช้ฟังก์ชัน listCategory(token)
   //    const [categories, setCategories] = useState([]);

   //ถ้าโหลด<FormCategory /> ที่Category.jsx จะทําการเรียกใช้ฟังก์ชัน getCategory() อัตโนมัติ
   const categories = useEcomStore((state) => state.categories);
   const getCategory = useEcomStore((state) => state.getCategory);
   console.log(categories);
   const { toast } = useToast();
   const [alert, setAlert] = useState(null); //for alert Warning!
   const [showDialog, setShowDialog] = useState(false); //for alert Confirm
   const [categoryToRemove, setCategoryToRemove] = useState({});

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
      getCategory().then((result) => {
         console.log("category->", result);
      });
   }, [getCategory]);

   //add single category Btn
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!name || name.trim() === "") {
         setAlert(
            <Alert variant='destructive'>
               <AlertCircle className='h-4 w-4' />
               <AlertTitle>Warning!</AlertTitle>
               <AlertDescription>Please enter a category name.</AlertDescription>
            </Alert>
         );
         //hide this alert after 3 seconds
         setTimeout(() => {
            setAlert(null);
         }, 3000);
         return;
      }

      // toast.warning("Please enter category name.");

      try {
         //เอา name(string ธรรมดา) มาครอบ {..} ► ได้ { name: <string value> }
         //ระวัง: ถ้าส่งตรงนี้ไป จะได้ไปสร้างข้อมูลใน DB
         const res = await createCategory(token, { name });
         console.log(res.data.name);

         toast({
            title: "Add Category Success!",
            description: `Category: ${res.data.name}`
         });

         getCategory(); //to update the list
         setName(""); //to empty the input text after click 'Add Category' btn
         setAlert(null);
         //  e.target.reset();//to empty the input text after click 'Add Category' btn
      } catch (err) {
         console.log(err);
      }
   };

   //remove single category Btn
   const handleRemove = (id, categoryName) => {
      //bring id and name of category.item when click <Trash2 />
      setCategoryToRemove({ ...categoryToRemove, id, name: categoryName });
      setShowDialog(true);
      //true to ONLY show dialog
      //Click 'Cancel' → setShowDialog(false);
      //Click 'Continue' → call confirmRemove() ▼
   };

   const confirmRemove = async () => {
      try {
         await removeCategory(token, categoryToRemove.id);
         toast({
            title: "You've removed category!",
            description: `ID: ${categoryToRemove.id} Category: ${categoryToRemove.name}`
         });
         getCategory();
         setShowDialog(false);
         setCategoryToRemove(null);
      } catch (err) {
         console.log(err);
      }
   };

   // const handleRemove = async (id, name) => {
   //    console.log(id);
   //    try {
   //       //confirm to remove
   //       setAlert(
   //          <AlertDialog>
   //             <AlertDialogTrigger asChild>
   //                {/* <Button variant='outline'>Show Dialog</Button> */}
   //             </AlertDialogTrigger>
   //             <AlertDialogContent>
   //                <AlertDialogHeader>
   //                   <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
   //                   <AlertDialogDescription>
   //                      his action cannot be undone. This will permanently delete your category and
   //                      remove its all products data from our servers.
   //                   </AlertDialogDescription>
   //                </AlertDialogHeader>
   //                <AlertDialogFooter>
   //                   <AlertDialogCancel>Cancel</AlertDialogCancel>
   //                   <AlertDialogAction>Continue</AlertDialogAction>
   //                </AlertDialogFooter>
   //             </AlertDialogContent>
   //          </AlertDialog>
   //       );

   //       const res = await removeCategory(token, id);

   //       // setAlert(
   //       //    <Alert variant='destructive'>
   //       //       <AlertCircle className='h-4 w-4' />
   //       //       <AlertTitle>Warning!</AlertTitle>
   //       //       <AlertDescription>{`You've removed category: ${name}.`}</AlertDescription>
   //       //    </Alert>
   //       // );
   //       toast({
   //          title: "You've removed category!",
   //          description: `Category: ${name}`
   //       });
   //       // toast.success(`Remove Category: ${name} Success.`);

   //       getCategory(token);
   //       console.log(res);
   //    } catch (err) {
   //       console.log(err);
   //    }
   // };
   return (
      <div>
         <div className='w-full space-y-6 max-w-3xl  '>
            <Card className='w-full max-w-3xl rounded-xl'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <PackagePlus className='w-5 h-5' />
                     Category register
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='mb-4'>{alert}</div>
                  <form
                     onSubmit={handleSubmit}
                     className='flex gap-4'
                  >
                     <Input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder='Enter a category name'
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                     />
                     <Button
                        type='submit'
                        className=' hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out'
                     >
                        Add Category
                     </Button>
                  </form>
               </CardContent>
            </Card>
            <Card className='w-full max-w-3xl rounded-xl'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <FileText className='w-4 h-4' />
                     Categories List
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='relative overflow-x-auto'>
                     <table className='w-full text-sm text-left'>
                        <thead className='text-xs uppercase bg-gray-50'>
                           <tr>
                              <th className='px-6 py-3'>ID</th>
                              <th className='px-6 py-3'>Category title</th>
                              <th className='px-6 py-3 text-right'>Remove</th>
                           </tr>
                        </thead>
                        <tbody>
                           {categories.map((item) => (
                              <tr
                                 key={item.id}
                                 className='bg-white border-b hover:bg-gray-50'
                              >
                                 <td className='px-6 py-4'>{item.id}</td>
                                 <td className='px-6 py-4'>{item.name}</td>
                                 <td className='px-6 py-4 text-right'>
                                    <Button
                                       variant='ghost'
                                       size='icon'
                                       onClick={() => handleRemove(item.id, item.name)}
                                       className='hover:text-rose-700'
                                    >
                                       <Trash2 className='w-4 h-4' />
                                    </Button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <AlertDialog
                        open={showDialog}
                        onOpenChange={setShowDialog}
                     >
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                 This action cannot be undone. This will permanently delete your
                                 category and remove its data from our servers.
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setShowDialog(false)}>
                                 Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={confirmRemove}>
                                 Yes, delete
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

FormCategory.propTypes = {};

export default FormCategory;
