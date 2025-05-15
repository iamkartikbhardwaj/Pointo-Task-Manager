import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

export interface ColumnDialogProps {
  initial?: { _id: string; title: string };
  onSubmit: (title: string, id?: string) => Promise<void>;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function ColumnDialog({
  initial,
  onSubmit,
  children,
  onOpenChange,
}: ColumnDialogProps) {
  const mode = initial ? "edit" : "create";
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setOpen(true);
    }
  }, [initial]);

  const handle = async () => {
    if (!title.trim()) {
      toast.error("Board title required");
      return;
    }
    await onSubmit(title.trim(), initial?._id);
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Taskboard" : "New Taskboard"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-1.5 mb-4 mt-2">
          <Label htmlFor="board-title">Board Title</Label>
          <Input
            id="board-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handle}
            className="bg-accent-foreground cursor-pointer hover:bg-green-600"
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
