import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const Table = ({ data, deleteMenu, setEditMenu }) => {
  const columns = [
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
      accessorKey: 'action',
      cell: ({ row }) => (
        <>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 "
            onClick={() => deleteMenu(row.original.id)}
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-md bg-white border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className=" text-xs uppercase bg-gray-100 text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
    </div>
  );
};

export default Table;
