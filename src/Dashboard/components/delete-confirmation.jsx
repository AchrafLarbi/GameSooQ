"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) {
  const handleConfirm = async () => {
    await onConfirm(); // Wait for the confirmation action to complete
    onClose(); // Close the dialog after the action is done
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-zinc-950 hover:text-black rounded-xl hover:bg-zinc-300 "
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="border border-zinc-950 bg-red-500  hover:text-white rounded-xl hover:bg-red-700"
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
