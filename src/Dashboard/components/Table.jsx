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

export const DataTable = ({ title, data, columns, searchKey, onAdd }) => {
  return (
    <div className="p-6 w-full  shadow-sm rounded-lg">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">
        Gérez le catalogue de {title.toLowerCase()}
      </p>

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Rechercher..."
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
        />
        <Button
          className=" hover:bg-zinc-950 text-zinc-950 "
          onClick={onAdd}
          variant="outline"
        >
          Ajouter
        </Button>
      </div>

      <Table className="w-full  border-white">
        <TableHeader className="hover:bg-zinc-700">
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessorKey || col.id}
                className="p-3 text-left text-gray-400  font-medium"
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
                      className="p-3 border-t border-gray-200"
                    >
                      {col.cell({ row })}
                    </TableCell>
                  );
                } else {
                  // Default cell rendering
                  return (
                    <TableCell
                      key={col.accessorKey || col.id}
                      className="p-3  border-t border-gray-200"
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
