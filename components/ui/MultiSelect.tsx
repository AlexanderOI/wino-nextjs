"use client"
import { X } from "lucide-react"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Button } from "./button"

interface MultiSelectProps {
  placeholder: string
  name?: string
  onChange: (value: string[]) => void
  children: ReactNode
  defaultValue: string[]
}

export type objectSelect = {
  key: string
  value: string
}

export const MultiSelect = ({
  placeholder,
  children,
  name,
  onChange,
  defaultValue,
}: MultiSelectProps) => {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<objectSelect[]>([])
  const [options, setOptions] = useState<objectSelect[]>([])
  const [selectArrow, setSelectArrow] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const optionRef = useRef<HTMLSelectElement>(null)

  const filteredOptions = options.filter(
    (item) =>
      typeof item.value === "string" &&
      item.value
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase().trim()) &&
      !selected.find((selectedItem) => selectedItem.key === item.key)
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart())
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const selectedOption = filteredOptions[selectArrow]
      if (selectedOption) {
        setSelected((prev) => [...prev, selectedOption])
        setQuery("")
        setSelectArrow(0)
      }
    }

    if (event.key === "Backspace" && query.length === 0) {
      setSelected((prev) => prev.slice(0, -1))
    }

    if (event.key === "ArrowDown") {
      setSelectArrow((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    }

    if (event.key === "ArrowUp") {
      setSelectArrow((prev) => Math.max(prev - 1, 0))
    }
  }

  const handleClickMenuOptions = (option: objectSelect) => {
    setSelected((prev) => [...prev, option])
    setQuery("")
    setMenuOpen(true)
  }

  useEffect(() => {
    onChange(selected.map((item) => item.key))
  }, [selected])

  const handleFocusQuery = () => {
    setSelectArrow(-1)
  }

  const handleMouseEnter = (index: number) => {
    setSelectArrow(index)
  }

  const handleMouseLeave = () => {
    setSelectArrow(-1)
  }

  useEffect(() => {
    if (children) {
      const initialOptions = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const value = child.props.value
          const texto = child.props.children ?? ""
          return { key: String(value ?? ""), value: String(texto) }
        }
        return null
      })?.filter(Boolean)

      if (initialOptions) {
        setOptions(initialOptions)

        const defaultValues = initialOptions.filter((value) =>
          defaultValue.includes(value.key)
        )
        setSelected(defaultValues)
      }
    }
  }, [])

  return (
    <div
      className={`bg-background border rounded-md relative text-xs mb-5 hover:border-zinc-200 mt-1 ${
        menuOpen && "border-zinc-200"
      }`}
    >
      <div className="bg-background rounded-md relative flex flex-wrap gap-1 p-[7px] w-[98%]">
        {selected.map((option) => {
          return (
            <div
              key={option.key}
              className="rounded-sm bg-dark-900 px-1 border flex items-center gap-2"
            >
              {option.value}
              <div
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  setSelected((prev) =>
                    prev.filter(
                      (selectedItem) => selectedItem.key !== option.key
                    )
                  )
                }
              >
                {option?.value.length > 0 && (
                  <X className="w-4 cursor-pointer" />
                )}
              </div>
            </div>
          )
        })}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChangeQuery}
          onFocus={() => setMenuOpen(true)}
          onBlur={() => setMenuOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length <= 0 ? placeholder : ""}
          className="text-sm bg-transparent flex-1 w-full min-h-6"
        />
        <div className="absolute right-[-6px] top-0 bottom-0 flex items-center">
          <span
            className="cursor-pointer"
            onClick={() => {
              setSelected([])
              inputRef.current?.focus()
            }}
          >
            <X className="w-4 cursor-pointer" />
          </span>
        </div>
      </div>

      {/* Menu's */}
      {menuOpen ? (
        <div className="dark:bg-dark-900 z-30 rounded-sm border absolute w-full max-h-64 mt-2 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
          <ul className="w-full">
            {filteredOptions.length ? (
              filteredOptions.map((option, i) => (
                <li
                  key={option.key}
                  className={`p-2 cursor-pointer rounded-md w-full ${
                    i === selectArrow && "text-sky-500"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave()}
                  onClick={() => handleClickMenuOptions(option)}
                >
                  {option.value}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options available</li>
            )}
          </ul>
        </div>
      ) : null}

      <select ref={optionRef} multiple name={name + "[]"} className="hidden">
        {children}
      </select>
    </div>
  )
}

interface optionProps {
  value: string | number
  children: ReactNode
}

export const OptionMultiSelect = ({ value, children }: optionProps) => {
  return <option value={value}>{children}</option>
}
