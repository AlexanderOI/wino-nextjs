export type FieldType = "text" | "number" | "email" | "select" | "date" | "datetime"

export interface SelectOption {
  _id: string
  value: string
  order: number
}

export interface FormField {
  _id: string
  label: string
  placeholder: string
  type: FieldType
  options?: SelectOption[]
  order: number
}

export interface FormSchema {
  _id: string
  name: string
  fields: FormField[]
  projectName?: string
  createdAt?: string
  updatedAt?: string
}
