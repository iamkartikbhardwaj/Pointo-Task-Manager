import {
  Droppable,
  Draggable,
  type DroppableProvided,
  type DraggableProvided,
} from "@hello-pangea/dnd";

import { TaskCard } from "./TaskCard";
import { ActionsMenu } from "../ActionsMenu";
import { Ellipsis } from "lucide-react";
import type { Column } from "@/api/columns";
import type { Task } from "@/api/tasks";

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onEditColumn: (col: Column) => void;
  onDeleteColumn: (col: Column) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function Column({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask,
}: ColumnProps) {
  return (
    <Droppable droppableId={column._id}>
      {(dropProvided: DroppableProvided) => (
        <div
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          className="bg-gray-100 p-4 w-72 flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-4 p-3 border-b-3 border-accent-foreground">
            <h3 className="font-medium">
              {column.title}
              <span className="bg-accent px-2 py-1 rounded-full text-xs ml-2">
                {tasks.length}
              </span>
            </h3>
            {column.title !== "Backlog" && (
              <ActionsMenu
                onEdit={() => onEditColumn(column)}
                onDelete={() => onDeleteColumn(column)}
                IconComponent={Ellipsis}
              />
            )}
          </div>

          {tasks.map((task, idx) => (
            <Draggable key={task._id} draggableId={task._id} index={idx}>
              {(dragProvided: DraggableProvided) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </div>
              )}
            </Draggable>
          ))}

          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
