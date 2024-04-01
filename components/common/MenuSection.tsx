import { useAsideContext } from "@/context/AsideResponsiveProvider"

interface PropsMenuSection {
  title: string
  children: React.ReactNode
}

export const MenuSection = ({ title, children }: PropsMenuSection) => {
  const { asideResposive } = useAsideContext()

  return (
    <>
      {asideResposive.temp ? (
        <div className="relative">
          <div className="text-sky-600 uppercase font-semibold text-sm py-2 px-5">
            <p className="">{title}</p>
          </div>
          <ul className="p-2">{children}</ul>
        </div>
      ) : (
        <ul className="">{children}</ul>
      )}
    </>
  )
}
