import './ColorPicker.css'
import React from 'react'
import { Undo } from 'lucide-react'
import { Color } from '../types'

type ColorPickerProps = {
  color: string
  colors?: Color[]
  customColors?: string[]
  onChange: (color: string) => void
}


export default function ColorPicker({
  colors,
  onChange,
}: Readonly<ColorPickerProps>): React.JSX.Element {
  const onReset = (): void => {
    onChange('')
  }

  return (
    <div className="color-picker-wrapper flex flex-col gap-2">

      <button
        className="w-full p-2 bg-transparent hover:bg-black dark:hover:bg-white hover:bg-opacity-10"
        onClick={onReset}
      >
        <Undo strokeWidth={1.5} className="w-5 h-5 mr-1" /> Reset color
      </button>
      {colors
        ?.filter((c) => c.type === 'button')
        .map((color, i) => (
          <button
            key={i}
            className="w-full p-2 flex gap-2 items-center bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:bg-opacity-10"
            onClick={() => onChange(color.color)}
          >
            <div
              className="w-6 h-6 rounded-full inline-block"
              style={{ backgroundColor: color.color }}
            ></div>
            {color.label}
          </button>
        ))}
    </div>
  )
}
