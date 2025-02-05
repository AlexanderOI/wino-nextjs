import NotFound from "@/components/common/errors/not-found"

export default function NotFoundPage() {
  return (
    <NotFound
      title="Project not found"
      message="Sorry, we couldn't find the project you're looking for."
      linkText="Back to projects"
      linkHref="/manage-projects"
    />
  )
}
