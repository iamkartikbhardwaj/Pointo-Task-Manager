import axios from "./axiosConfig";

export interface Column {
  _id: string;
  title: string;
  projectId: string;
  position: number;
}

// List columns for a project
export const fetchColumns = async (projectId: string): Promise<Column[]> => {
  const res = await axios.get<Column[]>(`/projects/${projectId}/columns`);
  return res.data;
};

// Create a new column
export const createColumn = async (
  projectId: string,
  title: string
): Promise<Column> => {
  const res = await axios.post<Column>(`/projects/${projectId}/columns`, {
    title,
  });
  return res.data;
};

// Update a single column’s title/position
export const updateColumn = async (
  projectId: string,
  columnId: string,
  updates: Partial<Pick<Column, "title" | "position">>
): Promise<Column> => {
  const res = await axios.post<Column>(
    `/projects/${projectId}/columns/${columnId}`,
    updates
  );
  return res.data;
};

// Reorder all columns in one call
export const updateColumnPositions = async (
  projectId: string,
  columns: Array<Pick<Column, "_id" | "position">>
): Promise<void> => {
  await axios.post(`/projects/${projectId}/columns/positions`, { columns });
};

// Delete a column
export const deleteColumn = async (
  projectId: string,
  columnId: string
): Promise<void> => {
  await axios.delete(`/projects/${projectId}/columns/${columnId}`);
};
