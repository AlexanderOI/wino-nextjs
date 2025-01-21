import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void
}

export function ToggleInput({ value, onChange, ...props }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  const handleBlur = () => {
    setIsEditing(false)
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="flex items-center cursor-text w-full h-[22px] overflow-hidden"
    >
      {isEditing ? (
        <Input
          className="p-0 m-0 border-none h-auto w-full overflow-hidden whitespace-normal break-words"
          type="text"
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          autoFocus
          {...props}
        />
      ) : (
        <span>{value || "Click para editar"}</span>
      )}
    </div>
  )
}
