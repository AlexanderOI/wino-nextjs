"use client"

import { useState, useCallback, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const presetColors = [
  "#FF0000", // Rojo
  "#00FF00", // Verde
  "#0000FF", // Azul
  "#FFFF00", // Amarillo
  "#FF00FF", // Magenta
  "#00FFFF", // Cian
  "#FFA500", // Naranja
  "#800080", // Púrpura
]

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

export default function ColorPicker({
  value = "#33254a",
  onChange,
  className,
}: ColorPickerProps) {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)
  const [hexColor, setHexColor] = useState(value)
  const [isInitialized, setIsInitialized] = useState(false)

  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }, [])

  const hexToHsl = useCallback((hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [0, 0, 0]
    const r = Number.parseInt(result[1], 16) / 255
    const g = Number.parseInt(result[2], 16) / 255
    const b = Number.parseInt(result[3], 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s,
      l = (max + min) / 2
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }, [])

  useEffect(() => {
    if (!isInitialized) {
      const [h, s, l] = hexToHsl(value)
      setHue(h)
      setSaturation(s)
      setLightness(l)
      setHexColor(value)
      setIsInitialized(true)
    } else if (value !== hexColor) {
      const [h, s, l] = hexToHsl(value)
      setHue(h)
      setSaturation(s)
      setLightness(l)
      setHexColor(value)
    }
  }, [value, hexToHsl, isInitialized, hexColor])

  useEffect(() => {
    if (isInitialized) {
      const newHexColor = hslToHex(hue, saturation, lightness)
      if (newHexColor !== hexColor) {
        setHexColor(newHexColor)
        onChange?.(newHexColor)
      }
    }
  }, [hue, saturation, lightness, hslToHex, onChange, hexColor, isInitialized])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    const [h, s, l] = hexToHsl(newHex)
    setHexColor(newHex)
    setHue(h)
    setSaturation(s)
    setLightness(l)
    onChange?.(newHex)
  }

  const handlePresetColorClick = (presetColor: string) => {
    const [h, s, l] = hexToHsl(presetColor)
    setHexColor(presetColor)
    setHue(h)
    setSaturation(s)
    setLightness(l)
    onChange?.(presetColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-10 h-10 rounded-md border cursor-pointer my-1 mb-2",
            className
          )}
          style={{ backgroundColor: hexColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-dark-800">
        <div className="space-y-4">
          <div className="w-full h-24 rounded-md" style={{ backgroundColor: hexColor }} />
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-md border"
                style={{ backgroundColor: color }}
                onClick={() => handlePresetColorClick(color)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label>Tono</Label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[hue]}
              onValueChange={([value]) => setHue(value)}
              className="[&_[role=slider]]:bg-purple-light"
            />
          </div>
          <div className="space-y-2">
            <Label>Saturación</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[saturation]}
              onValueChange={([value]) => setSaturation(value)}
              className="[&_[role=slider]]:bg-purple-light"
            />
          </div>
          <div className="space-y-2">
            <Label>Luminosidad</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[lightness]}
              onValueChange={([value]) => setLightness(value)}
              className="[&_[role=slider]]:bg-purple-light"
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Hexadecimal</Label>
            <Input
              value={hexColor}
              onChange={handleHexChange}
              className="uppercase bg-transparent"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
