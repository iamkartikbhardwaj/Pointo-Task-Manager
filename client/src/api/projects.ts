import axios from "./axiosConfig";

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  const res = await axios.get<Project[]>("/projects");
  return res.data;
};

// Create a new project
export const createProject = async (
  title: string,
  description: string = "default description"
): Promise<Project> => {
  const res = await axios.post<Project>("/projects", { title, description });
  return res.data;
};

// Update an existing project
export const updateProject = async (updated: Project): Promise<Project> => {
  const res = await axios.post<Project>(`/projects/${updated._id}`, {
    title: updated.title,
    description: updated.description,
  });
  return res.data;
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`/projects/${id}`);
};
