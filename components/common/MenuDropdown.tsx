import { useAsideContext } from "@/context/AsideResponsiveProvider"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

interface PropsMenuDropdown {
  Icon: React.ReactNode
  children: React.ReactNode
  title: string
}

export const MenuDropdown = ({ Icon, children, title }: PropsMenuDropdown) => {
  const { asideResposive } = useAsideContext()
  const [dropMenu, setDropMenu] = useState(false)

  return (
    <div className="py-1">
      {asideResposive.temp ? (
        <div>
          <div
            onClick={() => setDropMenu((prev) => !prev)}
            className="flex  justify-between hover:text-blue-300 text-sm gap-x-3 cursor-pointer"
          >
            <div className="flex items-center gap-x-3">
              <div className="icon-small">{Icon}</div>
              {title}
            </div>
            <ChevronRight
              className={`${
                dropMenu && "rotate-90"
              } transition-all duration-300 ease-in-out`}
            />
          </div>

          <div
            className={`pl-5 overflow-hidden transition-height duration-300 ease-in-out`}
            style={{ maxHeight: dropMenu ? "1000px" : "0" }}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="text-sky-600 w-full px-2.5 py-1">{Icon}</div>
      )}
    </div>
  )
}
