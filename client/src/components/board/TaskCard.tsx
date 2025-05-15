import type { Task } from "@/api/mock";
import { ActionsMenu } from "../ActionsMenu";
import { EllipsisVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{task.title}</h4>
        <ActionsMenu
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task)}
          IconComponent={EllipsisVertical}
        />
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="bg-accent rounded-md py-0.5 px-3 mt-2 inline-block">
          <p className="text-accent-foreground text-sm">
            {task._id.slice(-5).toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
