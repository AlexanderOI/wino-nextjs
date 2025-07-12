import { TypographyH1 } from "@/components/ui/typography"
import { FormBuilder } from "@/features/form/components/builder/form-builder"

export default function Page() {
  return (
    <div className="flex flex-col p-6">
      <TypographyH1>Create New Form</TypographyH1>
      <div className="flex-1">
        <FormBuilder />
      </div>
    </div>
  )
}
