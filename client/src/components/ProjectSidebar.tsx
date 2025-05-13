import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface ProjectSidebarProps {
  projects: string[];
  onAdd: (name: string) => void;
  onSelect: (name: string) => void;
  selected?: string;
}

export function ProjectSidebar({
  projects,
  onAdd,
  onSelect,
  selected,
}: ProjectSidebarProps) {
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);
  const handleCreate = () => {
    if (!newName.trim()) {
      toast.warning("Project name required", {
        description: "Please enter a name before creating a project.",
      });
      return;
    }
    onAdd(newName.trim());
    setNewName("");
    setOpen(false);
  };

  return (
    <aside className="w-64 bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        {/* Add-project dialog trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
            >
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create new project</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-4"
            />
            <DialogFooter>
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent cursor-pointer"
                onClick={handleCreate}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {projects.map((p) => (
            <li key={p} className="my-1">
              <button
                className={`
                  w-full text-left px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer  
                  ${
                    p === selected
                      ? "bg-accent text-accent-foreground font-medium"
                      : ""
                  }
                `}
                onClick={() => onSelect(p)}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
