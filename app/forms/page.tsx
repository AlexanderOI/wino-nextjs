import { BookMarked } from "lucide-react"

import { TypographyH1, TypographyP } from "@/components/ui/typography"

import { FormTable } from "@/features/form/components/datatable/form-table"
import { ButtonCreateForm } from "@/features/form/components/datatable/buttom-create-form"
import { getFormsTask } from "@/features/form/actions/form.action"

export default async function FormPage() {
  const forms = await getFormsTask()

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <TypographyH1 className="flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-purple-400" />
              Manage Forms
            </TypographyH1>
            <TypographyP className="text-gray-400">
              Manage forms used in project tasks
            </TypographyP>
          </div>

          <ButtonCreateForm />
        </div>
        <div className="flex-1">
          <FormTable forms={forms} />
        </div>
      </div>
    </div>
  )
}
