import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  className?: string
}

export const DropdownActionItem = ({ children, className }: Props) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent",
      className
    )}
  >
    {children}
  </div>
)
