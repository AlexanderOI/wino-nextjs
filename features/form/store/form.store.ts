import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  FieldType,
  FormField,
  FormSchema,
  SelectOption,
} from "@/features/form/interfaces/form.interface"

interface FormStore {
  formSchema: FormSchema
  currentFieldSelected: FormField | null

  setCurrentFieldSelected: (field: FormField | null) => void
  setFormSchema: (schema: FormSchema) => void
  addField: (index: number, type: FieldType, placeholder: string) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  removeField: (id: string) => void
  updateFieldsOrder: (fields: FormField[]) => void
  updateFormName: (name: string) => void
  updateFieldOptions: (fieldId: string, options: SelectOption[]) => void
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formSchema: {
        _id: "",
        name: "Details Form",
        fields: [],
      },
      currentFieldSelected: null,

      setCurrentFieldSelected: (field) => set({ currentFieldSelected: field }),

      setFormSchema: (schema) => set({ formSchema: schema }),

      addField: (index, type, placeholder) =>
        set((state) => {
          const newField: FormField = {
            _id: `field-${Date.now()}`,
            label: "New Field",
            placeholder: placeholder,
            type: type,
            options: [],
            order: state.formSchema.fields.length + 1,
          }

          return {
            formSchema: {
              ...state.formSchema,
              fields: [
                ...state.formSchema.fields.slice(0, index + 1),
                newField,
                ...state.formSchema.fields.slice(index + 1),
              ],
            },
            currentFieldSelected: newField,
          }
        }),

      updateField: (id, updates) =>
        set((state) => ({
          formSchema: {
            ...state.formSchema,
            fields: state.formSchema.fields.map((field) =>
              field._id === id ? { ...field, ...updates } : field
            ),
          },
        })),

      removeField: (id) =>
        set((state) => ({
          formSchema: {
            ...state.formSchema,
            fields: state.formSchema.fields.filter((field) => field._id !== id),
          },
        })),

      updateFieldsOrder: (fields) =>
        set((state) => ({
          formSchema: {
            ...state.formSchema,
            fields,
          },
        })),

      updateFormName: (name) =>
        set((state) => ({
          formSchema: {
            ...state.formSchema,
            name,
          },
        })),

      updateFieldOptions: (fieldId, options) =>
        set((state) => ({
          formSchema: {
            ...state.formSchema,
            fields: state.formSchema.fields.map((field) =>
              field._id === fieldId ? { ...field, options } : field
            ),
          },
        })),
    }),
    {
      name: "form-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
