import React from "react";
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
   getSortedRowModel
} from "@tanstack/react-table";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from "@/components/ui/select";
//-----------------------------------------------------------
export function DataTable({ columns, data, onRowSelection, showToolbar = true }) {
   const [rowSelection, setRowSelection] = React.useState({});
   const [globalFilter, setGlobalFilter] = React.useState("");
   const [sorting, setSorting] = React.useState([]);

   //when called useReactTable() → auto passed to table and row props to header and cell functions in the columns array.
   const table = useReactTable({
      //data  → [{},{},..] to display in table, is fetched products from FormPromotion.jsx
      data,
      //[{}] → 1 obj===1 col. spec of col name===key 'accessorKey'|col name===key 'header'
      columns,
      //current state of the table
      state: {
         rowSelection,
         globalFilter,
         sorting
      },
      //enables or disables row selection.
      enableRowSelection: true,
      //callback function that's called when the row selection changes.
      onRowSelectionChange: setRowSelection,
      //fn return models used to render the table.
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel()
   });

   // Update parent component when selection changes
   React.useEffect(() => {
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
      onRowSelection?.(selectedRows);
   }, [rowSelection, table, onRowSelection]);

   return (
      <div className='space-y-4 p-6  bg-card shadow-md rounded-xl border-slate-200 border'>
         {showToolbar && (
            <div className='flex items-center justify-between'>
               <div className='flex w-full max-w-sm items-center space-x-2'>
                  <Input
                     placeholder='Search...'
                     value={globalFilter ?? ""}
                     onChange={(e) => setGlobalFilter(String(e.target.value))}
                     className='h-8 w-[150px] lg:w-[250px] shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                  />
               </div>
               <div className='flex items-center space-x-2'>
                  <p className='text-sm text-muted-foreground'>
                     {table.getSelectedRowModel().rows.length} of{" "}
                     {table.getFilteredRowModel().rows.length} row(s) selected.
                  </p>
               </div>
            </div>
         )}

         <div className='rounded-md border'>
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && "selected"}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className='h-24 text-center'
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         <div className='flex items-center justify-end space-x-2 py-4'>
            <div className='flex items-center space-x-2'>
               <p className='text-sm font-medium'>Rows per page</p>
               <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                     table.setPageSize(Number(value));
                  }}
               >
                  <SelectTrigger className='h-8 w-[70px]'>
                     <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side='top'>
                     {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem
                           key={pageSize}
                           value={`${pageSize}`}
                        >
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
               variant='outline'
               size='sm'
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
            >
               Previous
            </Button>
            <Button
               variant='outline'
               size='sm'
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
            >
               Next
            </Button>
         </div>
      </div>
   );
}
