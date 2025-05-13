// src/api/projects.ts
import axios from "./axiosConfig";

export interface Project {
  id: string;
  title: string;
  description: string;
}

export const fetchProjects = async (): Promise<Project[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = await axios.get<any, Project[]>("/projects");
  return projects;
};

export const createProject = async (
  title: string,
  description: string = "default description"
): Promise<Project> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = await axios.post<any, Project>("/projects", {
    title,
    description,
  });
  return project;
};
