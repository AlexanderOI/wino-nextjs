import { useAsideContext } from "@/context/AsideResponsiveProvider"

interface PropsMenuSection {
  title: string
  children: React.ReactNode
  variant?: "link"
  onClick?: () => void
}

export const MenuSection = ({
  title,
  children,
  variant,
  onClick,
}: PropsMenuSection) => {
  const { asideResposive } = useAsideContext()

  return (
    <>
      {asideResposive.temp ? (
        <div className="relative">
          <div className="text-sky-600 uppercase font-semibold text-sm pt-1 px-3">
            <p
              className={`${variant === "link" ? "hover:border-b-2" : ""}`}
              onClick={onClick}
            >
              {title}
            </p>
          </div>
          <ul className="p-2">{children}</ul>
        </div>
      ) : (
        <ul className="">{children}</ul>
      )}
    </>
  )
}
