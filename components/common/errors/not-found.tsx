"use server"
import Link from "next/link"

interface Props {
  title?: string
  message?: string
  linkText?: string
  linkHref?: string
}

const NotFound = ({
  title = "Not found",
  message = "Sorry, we couldn't find the page you're looking for.",
  linkText = "Back",
  linkHref = "/",
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-deep mb-4">{title}</h1>
        <p className="text-xl mb-8">{message}</p>
        <Link
          href={linkHref}
          className="bg-purple-deep hover:bg-purple-light font-bold py-2 px-4 rounded transition duration-300"
        >
          {linkText}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
