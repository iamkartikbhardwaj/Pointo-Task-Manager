import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { toast } from "sonner";

import type { Column, Task } from "@/api/mock";

export interface TaskDialogProps {
  columns: Column[];
  initial?: Task;
  onSubmit: (
    columnId: string,
    title: string,
    description: string,
    dueDate: string,
    id?: string
  ) => Promise<void>;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function TaskDialog({
  columns,
  initial,
  onSubmit,
  children,
  onOpenChange,
}: TaskDialogProps) {
  const mode = initial ? "edit" : "create";
  const [open, setOpen] = useState(false);
  const [columnId, setColumnId] = useState(columns[0]?._id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initial?.dueDate ? new Date(initial.dueDate) : undefined
  );

  // sync when “initial” changes
  useEffect(() => {
    if (initial) {
      setColumnId(initial.columnId);
      setTitle(initial.title);
      setDescription(initial.description);
      setDueDate(initial.dueDate ? new Date(initial.dueDate) : undefined);
      setOpen(true);
    }
  }, [initial]);

  useEffect(() => {
    if (!columns.find((c) => c._id === columnId)) {
      setColumnId(columns[0]?._id ?? "");
    }
  }, [columns, columnId]);

  const handle = async () => {
    if (!title.trim()) {
      toast.error("Task title required");
      return;
    }
    if (!dueDate) {
      toast.error("Due date required");
      return;
    }
    await onSubmit(
      columnId,
      title.trim(),
      description.trim(),
      dueDate.toISOString(),
      initial?._id
    );
    setTitle("");
    setDescription("");
    setDueDate(undefined);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        {/* Status */}
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label htmlFor="task-column">Status</Label>
          <Select value={columnId} onValueChange={setColumnId}>
            <SelectTrigger className="w-full">
              {columns.find((c) => c._id === columnId)?.title}
            </SelectTrigger>
            <SelectContent className="w-full">
              {columns.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="task-title">Task Title</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Due date */}
        <div className="flex flex-col space-y-1.5 mb-4">
          <Label htmlFor="task-due">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter>
          <Button
            onClick={handle}
            className="bg-accent-foreground cursor-pointer hover:bg-green-600"
          >
            {mode === "edit" ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
