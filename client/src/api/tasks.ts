import axios from "./axiosConfig";

export interface Task {
  _id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string;
  position: number;
  dueDate: string;
}

// List tasks for a project
export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  const res = await axios.get<Task[]>(`/projects/${projectId}/tasks`);
  return res.data;
};

// Create a new task
export const createTask = async (
  projectId: string,
  columnId: string,
  title: string,
  description: string,
  dueDate: string
): Promise<Task> => {
  const res = await axios.post<Task>(`/projects/${projectId}/tasks`, {
    columnId,
    title,
    description,
    dueDate,
  });
  return res.data;
};

// Update a single task’s fields
export const updateTask = async (
  projectId: string,
  taskId: string,
  updates: Partial<Omit<Task, "_id" | "projectId">>
): Promise<Task> => {
  const res = await axios.post<Task>(
    `/projects/${projectId}/tasks/${taskId}`,
    updates
  );
  return res.data;
};

// Reorder tasks in bulk
export const updateTaskPositions = async (
  projectId: string,
  tasks: Array<Pick<Task, "_id" | "columnId" | "position">>
): Promise<void> => {
  await axios.post(`/projects/${projectId}/tasks/positions`, { tasks });
};

// Delete a task
export const deleteTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  await axios.delete(`/projects/${projectId}/tasks/${taskId}`);
};
