import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { stateOptions } from './options'

export const State: React.FC<
  StateField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    className?: string
    placeholder?: string
    fieldClassName?: string
  }
> = ({ name, control, errors, label, required, className, placeholder, fieldClassName }) => {
  return (
    <div className={className}>
      <Label htmlFor={name} className={`${!label ? 'sr-only' : ''}`}>{label || name}</Label>

      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = stateOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className={`w-full rounded-none text-sm ${fieldClassName}`} id={name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-none">
                {stateOptions.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value} className="rounded-none">
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {required && errors[name] && <Error error={errors[name]} />}
    </div>
  )
}
