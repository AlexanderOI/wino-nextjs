import {
  Home,
  BookMarked,
  Settings,
  UserCog,
  Users,
  Building,
  FolderKanban,
  FolderOpenDot,
  FolderRoot,
  FolderCheck,
  LucideIcon,
} from "lucide-react"

export const iconMap: Record<string, LucideIcon> = {
  Home,
  BookMarked,
  Settings,
  UserCog,
  Users,
  Building,
  FolderKanban,
  FolderOpenDot,
  FolderRoot,
  FolderCheck,
}

export type IconName = keyof typeof iconMap
