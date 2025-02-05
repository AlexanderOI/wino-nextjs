import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Props {
  name: string
  onValueChange?: (name: string, value: string) => void
  onChange?: (value: string) => void
  value: string
  label: string
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

export default function SelectSimple({
  name,
  onValueChange,
  onChange,
  value,
  label,
  placeholder,
  className,
  children,
}: Props) {
  return (
    <Select
      name={name}
      onValueChange={(value) =>
        onValueChange ? onValueChange(name, value) : onChange?.(value)
      }
      value={value}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {children}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
