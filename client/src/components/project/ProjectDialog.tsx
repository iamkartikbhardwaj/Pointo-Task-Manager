import { useState, useEffect, type ReactNode } from "react";
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
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Button } from "../ui/button";

export interface ProjectDialogProps {
  initial?: { title: string; description: string };
  onSubmit: (title: string, description: string) => void;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectDialog({
  initial,
  onSubmit,
  children,
  onOpenChange,
}: ProjectDialogProps) {
  const mode = initial ? "edit" : "create";
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  // if initial changes, populate & open
  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setOpen(true);
    }
  }, [initial]);

  const handle = () => {
    if (!title.trim()) {
      toast.warning("Project name required");
      return;
    }
    onSubmit(title.trim(), description.trim());
    setTitle("");
    setDescription("");
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
            {mode === "edit" ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-1.5 mb-4 mt-2">
          <Label htmlFor="project-title">Project Name</Label>
          <Input
            id="project-title"
            placeholder="Enter project name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label htmlFor="project-desc">Description</Label>
          <Textarea
            id="project-desc"
            placeholder="Enter project description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
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
