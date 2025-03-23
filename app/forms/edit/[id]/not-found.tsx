import NotFound from "@/components/common/errors/not-found"

export default function NotFoundPage() {
  return (
    <NotFound
      title="Form not found"
      message="Sorry, we couldn't find the form you're looking for."
      linkText="Back to forms"
      linkHref="/forms"
    />
  )
}
