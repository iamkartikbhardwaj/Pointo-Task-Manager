// src/components/ActionsMenu.tsx
import type { ComponentType, SVGProps } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

export interface ActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  /** Pass in any icon component (e.g. from lucide-react) */
  IconComponent?: ComponentType<SVGProps<SVGSVGElement>>;
}

export function ActionsMenu({
  onEdit,
  onDelete,
  IconComponent = EllipsisVertical,
}: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="actions" className="cursor-pointer">
          <IconComponent className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
