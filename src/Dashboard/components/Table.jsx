import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export const DataTable = ({
  data,
  columns,
  onAdd,
  onSearch,
  value,
  disappear,
}) => {
  return (
    <div className="p-6 w-full  shadow-sm rounded-lg ">
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Rechercher..."
          className="w-1/3   rounded-xl   border-zinc-800 border-[1px] p-5 focus:outline-none focus:border-zinc-700"
          onChange={onSearch}
          value={value}
        />
        {disappear && (
          <Button
            className="flex items-center gap-2 hover:bg-gray-300 hover:text-black hover:border-zinc-700 text-zinc-950 border rounded-xl"
            onClick={onAdd}
            variant="outline"
          >
            <Plus className="w-5 h-5" />
            Ajouter
          </Button>
        )}
      </div>

      <Table className="w-full border border-black border-collapse">
        <TableHeader className="hover:bg-zinc-700">
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessorKey || col.id}
                className="p-7 text-left text-gray-400  font-medium "
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="hover:bg-zinc-700 transition-colors"
            >
              {columns.map((col) => {
                if (col.cell) {
                  // Use custom cell rendering if provided
                  return (
                    <TableCell
                      key={col.accessorKey || col.id}
                      className="p-7 border-t border-zinc-800"
                    >
                      {col.cell({ row })}
                    </TableCell>
                  );
                } else {
                  // Default cell rendering
                  return (
                    <TableCell
                      key={col.accessorKey || col.id}
                      className="p-7 w-1/2 border-t border-zinc-800"
                    >
                      {row[col.accessorKey]}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
