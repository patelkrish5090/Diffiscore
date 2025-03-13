import { useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Button } from "./button"
import { Card } from "./card"
import { X, Save } from "lucide-react"

export function ColorTweaker({ isOpen, onClose, onSave }) {
  const [color, setColor] = useState(() => {
    const root = document.documentElement
    const style = getComputedStyle(root)
    const hsl = style.getPropertyValue('--primary')
    // Convert HSL to hex for the color picker
    const match = hsl.match(/\d+/g)
    if (match) {
      const [h, s, l] = match
      return hslToHex(Number(h), Number(s), Number(l))
    }
    return "#2563eb" // Default blue
  })

  const handleColorChange = (newColor) => {
    setColor(newColor)
    // Convert hex to HSL and update CSS variable immediately for preview
    const hsl = hexToHSL(newColor)
    document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`)
  }

  const handleSave = () => {
    const hsl = hexToHSL(color)
    onSave(`${hsl.h} ${hsl.s}% ${hsl.l}%`)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        if (!isOpen) onClose(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed right-4 top-20 z-50">
      <Card className="w-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold">Color Tweaker</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <HexColorPicker color={color} onChange={handleColorChange} />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Preview:</span>
              <div 
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
              />
            </div>
            
            <Button className="w-full" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Color
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Color conversion utilities
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToHex(h, s, l) {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}