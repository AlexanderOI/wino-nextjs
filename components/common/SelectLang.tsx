"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { langOptions } from "@/constants/lang"
import { useState } from "react"

export function SelectLang() {
  const [lang, setLang] = useState("")

  return (
    <Select
      onValueChange={(value) => setLang(value)}
      defaultValue={navigator.language.slice(0, 2)}
    >
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(langOptions).map((key) => (
          <SelectItem key={key} value={key}>
            {langOptions[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
