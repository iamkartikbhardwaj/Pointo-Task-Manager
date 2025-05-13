// src/App.tsx
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { fetchProjects, createProject } from "./api/projects";
import type { Project } from "./api/projects";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchProjects();
        console.log(list);
        setProjects(list);
        setActive(list[0] ?? null);
      } catch {
        // errors are handled by axios interceptor
      }
    })();
  }, []);

  const handleAdd = async (title: string) => {
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
      const newProj = await createProject(title);
      setProjects((prev) => [...prev, newProj]);
      setActive(newProj);
      toast.success("Project created!");
    } catch {
      // errors are handled by axios interceptor
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Header />

      <div className="flex-1 flex overflow-hidden mx-14 my-4">
        <ProjectSidebar
          projects={projects.map((p) => p.title)}
          selected={active?.title}
          onAdd={handleAdd}
          onSelect={(title) => {
            const proj = projects.find((p) => p.title === title);
            if (proj) setActive(proj);
          }}
        />

        <main className="flex-1 p-6 overflow-auto">
          {active ? (
            /* <Board projectId={active.id} /> */
            <div>Your board for “{active.title}”</div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select or create a project to get started.
            </div>
          )}
        </main>
      </div>

      <Toaster richColors />
    </div>
  );
}

export default App;
