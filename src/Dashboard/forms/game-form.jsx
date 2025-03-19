"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GameForm({ game, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (game) {
      setFormData(game); // Initialize form data with the current game
    } else {
      setFormData({
        name: "",
      }); // Reset form data when adding a new game
    }
  }, [game, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Call the onSave function with the form data
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {game ? "Modifier  un  Jeu" : "Ajouter  un  Jeu"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3 border border-zinc-800 focus:border-zinc-700 text-white  rounded-xl"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="outline"
              className="border border-zinc-950 hover:text-black rounded-xl hover:bg-zinc-300"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
