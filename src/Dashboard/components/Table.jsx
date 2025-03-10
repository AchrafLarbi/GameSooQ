import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

const DataTable = ({ title, data, columns }) => {
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-400 mb-4">Gérez les {title.toLowerCase()} de votre plateforme</p>

      <div className="flex justify-between mb-4">
        <input type="text" placeholder="Rechercher..." className="p-2 rounded bg-gray-900 text-white w-1/3" />
        <Button className="flex gap-2">
          <Plus size={18} /> Ajouter
        </Button>
      </div>

      <Table className="w-full bg-gray-900 rounded-lg">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((cell, i) => (
                <TableCell key={i}>{cell}</TableCell>
              ))}
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Pencil size={16} />
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between">
        <Button variant="outline">Précédent</Button>
        <Button variant="outline">Suivant</Button>
      </div>
    </div>
  );
};

export default DataTable;
