import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { ColumnDialog } from "./ColumnDialog";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  updateTaskPositions,
  type Task,
} from "@/api/tasks";
import {
  createColumn,
  deleteColumn,
  fetchColumns,
  updateColumn,
  type Column as ColType,
} from "@/api/columns";
import { TaskDialog } from "./TaskDialog";
import { Column } from "./Column";
import { ConfirmDialog } from "../ConfirmDialog";
import { toast } from "sonner";
import { ActionsMenu } from "../ActionsMenu";
import type { Project } from "@/api/projects";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";

interface BoardProps {
  project: Project;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function Board({ project, onEditProject, onDeleteProject }: BoardProps) {
  const [columns, setColumns] = useState<ColType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingColumn, setEditingColumn] = useState<ColType | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<ColType | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    (async () => {
      const [cols, ts] = await Promise.all([
        fetchColumns(project._id),
        fetchTasks(project._id),
      ]);
      setColumns(cols.sort((a, b) => a.position - b.position));
      setTasks(ts.sort((a, b) => a.position - b.position));
    })();
  }, [project._id]);

  const handleCreateColumn = async (title: string) => {
    const newCol = await createColumn(project._id, title);
    setColumns((prev) =>
      [...prev, newCol].sort((a, b) => a.position - b.position)
    );
  };

  const handleCreateTask = async (
    columnId: string,
    title: string,
    description: string,
    dueDate: string
  ) => {
    const newTask = await createTask(
      project._id,
      columnId,
      title,
      description,
      dueDate
    );
    setTasks((prev) =>
      [...prev, newTask].sort((a, b) => a.position - b.position)
    );
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];

      // Find the task that was dragged
      const draggedTask = updatedTasks.find((t) => t._id === draggableId);
      if (!draggedTask) return prevTasks;

      // Remove the task from its original position
      const newTasks = updatedTasks.filter((t) => t._id !== draggableId);

      // If column changed, update the task's column
      if (destination.droppableId !== source.droppableId) {
        draggedTask.columnId = destination.droppableId;
      }

      // Calculate new positions based on destination index
      let newPosition: number;

      // Insert at the beginning
      if (destination.index === 0) {
        const firstTaskInDestination = newTasks
          .filter((t) => t.columnId === destination.droppableId)
          .sort((a, b) => a.position - b.position)[0];

        newPosition = firstTaskInDestination
          ? firstTaskInDestination.position / 2
          : 1000; // Default starting position
      }
      // Insert at the end
      else if (
        destination.index >=
        newTasks.filter((t) => t.columnId === destination.droppableId).length
      ) {
        const tasksInDestColumn = newTasks
          .filter((t) => t.columnId === destination.droppableId)
          .sort((a, b) => a.position - b.position);

        const lastTask = tasksInDestColumn[tasksInDestColumn.length - 1];
        newPosition = lastTask ? lastTask.position + 1000 : 1000;
      }
      // Insert in the middle
      else {
        const tasksInDestColumn = newTasks
          .filter((t) => t.columnId === destination.droppableId)
          .sort((a, b) => a.position - b.position);

        const beforeTask = tasksInDestColumn[destination.index - 1];
        const afterTask = tasksInDestColumn[destination.index];

        newPosition = (beforeTask.position + afterTask.position) / 2;
      }

      draggedTask.position = newPosition;

      return [...newTasks, draggedTask].sort((a, b) => a.position - b.position);
    });

    try {
      const draggedTask = tasks.find((t) => t._id === draggableId);
      if (!draggedTask) return;

      const reordered = tasks.map((task) => {
        if (task._id === draggableId) {
          return {
            _id: task._id,
            columnId: destination.droppableId,
            position: draggedTask.position,
          };
        }
        return {
          _id: task._id,
          columnId: task.columnId,
          position: task.position,
        };
      });

      await updateTaskPositions(project._id, reordered);
    } catch {
      // errors are handled by axios interceptor
    }
  };

  const handleSaveColumn = async (updated: ColType) => {
    try {
      const saved = await updateColumn(updated.projectId, updated._id, updated);
      setColumns((prev) => prev.map((c) => (c._id === saved._id ? saved : c)));
      toast.success("Board updated");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setEditingColumn(null);
    }
  };

  const handleConfirmDeleteColumn = async () => {
    if (!deletingColumn) return;
    try {
      await deleteColumn(deletingColumn.projectId, deletingColumn._id);
      setColumns((prev) => prev.filter((c) => c._id !== deletingColumn._id));
      toast.success("Board deleted");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setDeletingColumn(null);
    }
  };

  const handleSaveTask = async (updated: Task) => {
    try {
      const saved = await updateTask(updated.projectId, updated._id, updated);
      setTasks((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
      toast.success("Task updated");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setEditingTask(null);
    }
  };
  const handleConfirmDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.projectId, deletingTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      toast.success("Task deleted");
    } catch {
      // errors are handled by axios interceptor
    } finally {
      setDeletingTask(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold mb-4">
            {project.title}
            <span className="ml-2">
              <ActionsMenu
                onEdit={() => onEditProject(project)}
                onDelete={() => onDeleteProject(project)}
                IconComponent={Settings}
              />
            </span>
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <ColumnDialog onSubmit={handleCreateColumn}>
              <Button variant="outline" className="cursor-pointer">
                Add Taskboard
              </Button>
            </ColumnDialog>
            <TaskDialog columns={columns} onSubmit={handleCreateTask}>
              <Button
                variant="default"
                className="cursor-pointer bg-accent-foreground hover:bg-green-600"
              >
                Add Task
              </Button>
            </TaskDialog>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-x-auto overflow-y-auto flex-1 h-[calc(100vh-6rem)]">
            {columns.map((col) => (
              <Column
                key={col._id}
                column={col}
                tasks={tasks.filter((t) => t.columnId === col._id)}
                onEditColumn={(c) => setEditingColumn(c)}
                onDeleteColumn={(c) => setDeletingColumn(c)}
                onEditTask={(t) => setEditingTask(t)}
                onDeleteTask={(t) => setDeletingTask(t)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <ConfirmDialog
        open={!!deletingColumn}
        title="Delete Board?"
        description="This will delete the board."
        onConfirm={handleConfirmDeleteColumn}
        onCancel={() => setDeletingColumn(null)}
      />

      <ConfirmDialog
        open={!!deletingTask}
        title="Delete Task?"
        description="This action cannot be undone."
        onConfirm={handleConfirmDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />

      {editingColumn && (
        <ColumnDialog
          initial={{ _id: editingColumn._id, title: editingColumn.title }}
          onSubmit={async (newTitle) => {
            await handleSaveColumn({ ...editingColumn, title: newTitle });
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditingColumn(null);
            }
          }}
        />
      )}

      {editingTask && (
        <TaskDialog
          columns={columns}
          initial={editingTask}
          onSubmit={async (columnId, title, description, dueDate) => {
            await handleSaveTask({
              ...editingTask,
              columnId,
              title,
              description,
              dueDate,
            });
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
