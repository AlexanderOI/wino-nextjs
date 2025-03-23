import { List, Mail, Calculator, Calendar, Text, LucideIcon } from "lucide-react"
import { FieldType } from "@/features/form/interfaces/form.interface"

type formType = {
  id: FieldType
  name: string
  placeholder: string
  iconColor: string
  icon: LucideIcon
}

export const formTypes: formType[] = [
  {
    id: "text",
    name: "Text",
    placeholder: "Enter text",
    icon: Text,
    iconColor: "text-blue-500",
  },
  {
    id: "number",
    name: "Number",
    placeholder: "Enter number",
    icon: Calculator,
    iconColor: "text-green-500",
  },
  {
    id: "email",
    name: "Email",
    placeholder: "Enter email",
    icon: Mail,
    iconColor: "text-red-500",
  },
  {
    id: "select",
    name: "Select",
    placeholder: "Select option",
    icon: List,
    iconColor: "text-purple-500",
  },
  {
    id: "date",
    name: "Date",
    placeholder: "Select date",
    icon: Calendar,
    iconColor: "text-yellow-500",
  },
  {
    id: "datetime",
    name: "DateTime",
    placeholder: "Select date and time",
    icon: Calendar,
    iconColor: "text-orange-500",
  },
]
