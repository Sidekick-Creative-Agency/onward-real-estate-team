import type { CountryField } from '@payloadcms/plugin-form-builder/types'
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
import { countryOptions } from './options'

export const Country: React.FC<
  CountryField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    className?: string
    fieldClassName?: string
    placeholder?: string
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
          const controlledValue = countryOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className={`w-full rounded-none text-sm ${fieldClassName}`} id={name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-none">
                {countryOptions.map(({ label, value }) => {
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
