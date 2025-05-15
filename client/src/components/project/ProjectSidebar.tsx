import { Plus } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";
import { Button } from "../ui/button";

export interface ProjectSidebarProps {
  projects: string[];
  onAdd: (name: string, description: string) => void;
  onSelect: (name: string) => void;
  selected?: string;
}

export function ProjectSidebar({
  projects,
  onAdd,
  onSelect,
  selected,
}: ProjectSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <ProjectDialog onSubmit={onAdd}>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-white"
          >
            <Plus />
          </Button>
        </ProjectDialog>
      </div>

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {projects.map((p) => (
            <li key={p} className="my-1">
              <button
                className={`
                  w-full text-left px-4 py-2 rounded-md
                  hover:bg-accent hover:text-accent-foreground
                  cursor-pointer
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
