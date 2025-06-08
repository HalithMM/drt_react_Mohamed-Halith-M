import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useRef, useEffect, useState } from "react";

type Data = {
  noradCatId: string;
  intlDes: string;
  name: string;
  launchDate: string;
  decayDate: string | null;
  objectType: string;
  launchSiteCode: string;
  countryCode: string;
  orbitCode: string;
};

type Props = {
  data: Data[];
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (selection: Record<string, boolean>) => void;
};

const STORAGE_KEY = "selectedAssets";

const AssetTable: React.FC<Props> = ({ 
  data, 
  rowSelection, 
  onRowSelectionChange
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const selectedCount = Object.keys(rowSelection).filter(id => rowSelection[id]).length;
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); 
  useEffect(() => {
    if (data.length > 0 && !initialLoadComplete) {
      console.log('Loading selection from localStorage with data available');
      const savedSelection = localStorage.getItem(STORAGE_KEY);
      console.log('Saved selection from storage:', savedSelection);
      
      if (savedSelection) {
        try {
          const parsedSelection = JSON.parse(savedSelection);
          console.log('Parsed selection:', parsedSelection);
           
          const currentIds = new Set(data.map(d => d.noradCatId));
          const validSelection = Object.fromEntries(
            Object.entries(parsedSelection)
              .filter(([id]) => currentIds.has(id))
          );
          
          console.log('Valid selection after filtering:', validSelection);
          
          if (Object.keys(validSelection).length > 0) {
            console.log('Applying valid selection to state');
            onRowSelectionChange(validSelection);
          }
        } catch (e) {
          console.error("Failed to parse saved selection", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setInitialLoadComplete(true);
    }
  }, [data, initialLoadComplete, onRowSelectionChange]); 
  useEffect(() => {
    if (initialLoadComplete) {
      console.log('Saving selection to localStorage:', rowSelection);
      try {
        if (Object.keys(rowSelection).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rowSelection));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error saving to localStorage", e);
      }
    }
  }, [rowSelection, initialLoadComplete]);

  const columns: ColumnDef<Data>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex flex-col items-center">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => {
              const newSelection: Record<string, boolean> = {};
              if (e.target.checked) {
                const rowsToSelect = table.getRowModel().rows.slice(0, 10);
                rowsToSelect.forEach(row => {
                  newSelection[row.id] = true;
                });
              }
              onRowSelectionChange(newSelection);
            }}
            className="mb-1"
          />
          <span className="text-xs text-gray-500">
            {selectedCount}/10 selected
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            if (!row.getIsSelected() && selectedCount >= 10) {
              alert("You can only select up to 10 items");
              return;
            }
            const newSelection = { ...rowSelection };
            if (e.target.checked) {
              newSelection[row.id] = true;
            } else {
              delete newSelection[row.id];
            }
            onRowSelectionChange(newSelection);
          }}
        />
      ),
    },
    { accessorKey: "noradCatId", header: "Norad ID" },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "intlDes",
      header: "COSPAR ID",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value?.trim() ? value : "-";
      },
    },
    { accessorKey: "orbitCode", header: "Orbit" },
    { accessorKey: "countryCode", header: "Country" },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow.noradCatId,
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  return (
    <div className="border rounded shadow-sm overflow-auto">
      <div className="grid grid-cols-6 bg-gray-200 font-semibold sticky top-0 z-10 text-sm" style={{ paddingRight: '15px' }}>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              className="border px-2 py-2 truncate text-center whitespace-nowrap"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))
        )}
      </div> 
      <div ref={parentRef} className="h-[500px] overflow-auto relative">
        <div style={{ height: `${totalHeight}px`, position: "relative",}}>
          {virtualRows.map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <div key={row.id} data-index={virtualRow.index} ref={rowVirtualizer.measureElement} className={`grid grid-cols-6 text-sm items-center absolute top-0 left-0 w-full 
              ${
                  row.getIsSelected()
                    ? "bg-blue-100"
                    : virtualRow.index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
                style={{transform: `translateY(${virtualRow.start}px)`,}}
                >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="border px-2 py-1 truncate text-center whitespace-nowrap" >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssetTable;