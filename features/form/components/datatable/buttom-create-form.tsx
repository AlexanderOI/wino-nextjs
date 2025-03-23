"use client"

import { useRouter } from "next/navigation"
import { BookPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFormStore } from "@/features/form/store/form.store"

export function ButtonCreateForm() {
  const router = useRouter()
  const formSchema = useFormStore((state) => state.formSchema)
  const setFormSchema = useFormStore((state) => state.setFormSchema)

  const handleCreateForm = () => {
    if (formSchema._id.length > 0) {
      setFormSchema({
        _id: "",
        name: "Details Form",
        fields: [],
      })
    }

    router.push("/forms/create")
  }

  return (
    <Button variant="purple" onClick={handleCreateForm}>
      <BookPlus className="w-6 h-6 mr-2" />
      Create Form
    </Button>
  )
}
