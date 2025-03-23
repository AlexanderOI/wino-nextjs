import { TypographyH1 } from "@/components/ui/typography"
import { FormBuilder } from "@/features/form/components/builder/form-builder"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditFormPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="flex flex-col p-6">
      <TypographyH1>Edit Form</TypographyH1>
      <div className="flex-1">
        <FormBuilder id={id} />
      </div>
    </div>
  )
}
