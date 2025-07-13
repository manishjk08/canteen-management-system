import { useState } from 'react';
import {
  useReactTable,
  CellContext,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef
} from '@tanstack/react-table';

interface MenuItem{
  id: number;
  date: string;
  dishes: string;
  max_capacity: number;
}
interface TableProps{
  data: MenuItem[];
  deleteMenu: (id: string) => void;
  setEditMenu: (menu: MenuItem) => void;
}
const Table: React.FC <TableProps> =  ({ data, deleteMenu, setEditMenu }) => {
  const [sorting,setSorting]=useState<SortingState>([])
  const[pagination,setPagination]=useState({
      pageIndex:0,
      pageSize:5,
  })
 
  const columns:ColumnDef<MenuItem>[] = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Dishes',
      accessorKey: 'dishes',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Max Capacity',
      accessorKey: 'max_capacity',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Action',
      id:'action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <>
          <button
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 "
            onClick={() => deleteMenu(row.original.id.toString())}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 mx-3"
            onClick={() => setEditMenu(row.original)}
          >
            Edit
          </button>
        </>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state:{
      sorting,
      pagination,
    },
    onSortingChange:setSorting,
    onPaginationChange:setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:getSortedRowModel(),
    getPaginationRowModel:getPaginationRowModel()
  });


  return (
    <>
    <div className="lg:w-3/4 overflow-x-auto rounded-xl shadow-md bg-white border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className=" text-xs uppercase bg-gray-100 text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 whitespace-nowrap" onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                   {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-2 m-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-2 py-1 text-white bg-blue-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-2 py-1 text-white rounded bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
     
      </>
  );
};

export default Table;
