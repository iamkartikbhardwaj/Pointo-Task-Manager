// src/App.tsx
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import { ProjectSidebar } from "./components/project/ProjectSidebar";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
} from "./api/projects";
import type { Project } from "./api/projects";
import { Board } from "./components/board/Board";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ProjectDialog } from "./components/project/ProjectDialog";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchProjects();
        setProjects(list);
        setActive(list[0] ?? null);
      } catch {
        // errors are handled by axios interceptor
      }
    })();
  }, []);

  const handleAdd = async (title: string, description: string) => {
    if (!title.trim()) {
      toast.error("Project title cannot be empty");
      return;
    }
    if (projects.some((p) => p.title === title)) {
      toast.error(
        title === active?.title
          ? "That is already your active project"
          : "A project with that title already exists"
      );
      return;
    }

    try {
      const newProj = await createProject(title, description);
      setProjects((prev) => [...prev, newProj]);
      setActive(newProj);
      toast.success("Project created!");
    } catch {
      // errors are handled by axios interceptor
    }
  };

  const handleSaveProject = async (updated: Project) => {
    try {
      const saved = await updateProject(updated);
      setProjects((prev) => prev.map((p) => (p._id === saved._id ? saved : p)));
      setActive(saved);
      toast.success("Project updated!");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setEditingProject(null);
    }
  };

  const handleConfirmDeleteProject = async () => {
    if (!deletingProject) return;
    try {
      await deleteProject(deletingProject._id);
      setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
      // if you deleted the active one, pick another or clear
      if (active?._id === deletingProject._id) {
        const remaining = projects.filter((p) => p._id !== deletingProject._id);
        setActive(remaining[0] ?? null);
      }
      toast.success("Project deleted!");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setDeletingProject(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Header />

      <div className="flex flex-1 overflow-hidden mx-14 my-4">
        <ProjectSidebar
          projects={projects.map((p) => p.title)}
          selected={active?.title}
          onAdd={handleAdd}
          onSelect={(title) => {
            const proj = projects.find((p) => p.title === title);
            if (proj) setActive(proj);
          }}
        />

        <main className="flex-1 p-6 overflow-auto min-w-0">
          {active ? (
            <Board
              project={active}
              onEditProject={(p) => setEditingProject(p)}
              onDeleteProject={(p) => setDeletingProject(p)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select or create a project to get started.
            </div>
          )}
        </main>
      </div>

      <Toaster richColors />

      <ConfirmDialog
        open={!!deletingProject}
        title="Delete Project?"
        description="This will delete the project and all its boards & tasks. Are you sure?"
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => setDeletingProject(null)}
      />

      {editingProject && (
        <ProjectDialog
          initial={{
            title: editingProject.title,
            description: editingProject.description,
          }}
          onSubmit={(newTitle, newDesc) => {
            handleSaveProject({
              ...editingProject,
              title: newTitle,
              description: newDesc,
            });
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
