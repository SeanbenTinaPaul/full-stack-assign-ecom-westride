// //for FormProduct
// const fileInputRef = useRef(null);
 
//  const handleButtonClick = () => {
//       fileInputRef.current?.click();
//    };

// <div className='p-6 space-y-6 max-w-3xl mx-auto'>
//             <h1 className='text-2xl font-bold mb-6'>Product Management</h1>
//             <Card className='shadow-lg'>
//                <CardHeader>
//                   <CardTitle className='flex items-center gap-2'>
//                      <Package className='w-5 h-5' />
//                      ข้อมูลพื้นฐาน
//                   </CardTitle>
//                </CardHeader>
//                <CardContent className='space-y-4'>
//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <Package2 className='w-4 h-4' />
//                         Product Name
//                      </label>
//                      <input
//                         type='text'
//                         placeholder='e.g. จานพลมเมลามีน, HP Laptop'
//                         className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                      />
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <FileText className='w-4 h-4' />
//                         Description
//                      </label>
//                      <textarea
//                         placeholder='e.g. มีสีฟ้าหวาน, อุปกรณ์'
//                         className='w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                      />
//                   </div>
//                </CardContent>
//             </Card>

//             <Card className='shadow-lg'>
//                <CardHeader>
//                   <CardTitle className='flex items-center gap-2'>
//                      <FolderOpen className='w-5 h-5' />
//                      รายละเอียดสินค้า
//                   </CardTitle>
//                </CardHeader>
//                <CardContent className='space-y-4'>
//                   <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                      <div className='space-y-2'>
//                         <label className='flex items-center gap-2 text-sm font-medium'>
//                            <DollarSign className='w-4 h-4' />
//                            Price (฿)
//                         </label>
//                         <input
//                            type='number'
//                            placeholder='e.g. 5000, 99.50'
//                            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                         />
//                      </div>

//                      <div className='space-y-2'>
//                         <label className='flex items-center gap-2 text-sm font-medium'>
//                            <Package2 className='w-4 h-4' />
//                            Quantity
//                         </label>
//                         <input
//                            type='number'
//                            placeholder='e.g. 150'
//                            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                         />
//                      </div>
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <Image className='w-4 h-4' />
//                         Product Image
//                      </label>
//                      <div className='flex items-center gap-4'>
//                         <input
//                            type='file'
//                            ref={fileInputRef}
//                            className='hidden'
//                            onChange={(e) => console.log(e.target.files)}
//                         />
//                         <button
//                            onClick={handleButtonClick}
//                            className='px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
//                         >
//                            Choose Files
//                         </button>
//                         <span className='text-sm text-gray-500'>No file chosen</span>
//                      </div>
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <FolderOpen className='w-4 h-4' />
//                         Category
//                      </label>
//                      <Select className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
//                         <SelectTrigger>
//                            <SelectValue placeholder='Select category' />
//                         </SelectTrigger>
//                         <SelectContent>
//                            {/* <SelectGroup> */}
//                            {/* <SelectLabel>North America</SelectLabel> */}
//                            <SelectItem value='est'>Eastern Standard Time (EST)</SelectItem>
//                            <SelectItem value='cst'>Central Standard Time (CST)</SelectItem>
//                            <SelectItem value='mst'>Mountain Standard Time (MST)</SelectItem>
//                            <SelectItem value='pst'>Pacific Standard Time (PST)</SelectItem>
//                            <SelectItem value='akst'>Alaska Standard Time (AKST)</SelectItem>
//                            <SelectItem value='hst'>Hawaii Standard Time (HST)</SelectItem>
//                            {/* </SelectGroup> */}
//                            {/* <SelectGroup> */}
//                            {/* <SelectLabel>Europe & Africa</SelectLabel> */}
//                            <SelectItem value='gmt'>Greenwich Mean Time (GMT)</SelectItem>
//                            <SelectItem value='cet'>Central European Time (CET)</SelectItem>
//                            <SelectItem value='eet'>Eastern European Time (EET)</SelectItem>
//                            <SelectItem value='west'>Western European Summer Time (WEST)</SelectItem>
//                            <SelectItem value='cat'>Central Africa Time (CAT)</SelectItem>
//                            <SelectItem value='eat'>East Africa Time (EAT)</SelectItem>
//                            {/* </SelectGroup> */}
//                         </SelectContent>
//                      </Select>
//                   </div>
//                </CardContent>
//             </Card>

//             <Button className='w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
//                Add Product
//             </Button>
//          </div>

// FormCategory old
// import {
//    Select,
//    SelectContent,
//    SelectGroup,
//    SelectItem,
//    SelectLabel,
//    SelectTrigger,
//    SelectValue
// } from "@/components/ui/select";
{/*  Work example. Not gonna use this  */}
{/* <div className='container mx-auto p-4 bg-Dropdown-option-night shadow-md rounded-md'>
<h1 className='text-2xl font-bold mb-6'>Category Management</h1>
{alert}
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
</div> */}