import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    rows?: number
    className?: string
    fieldClassName?: string
    placeholder?: string
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 3,
  placeholder,
  className,
  fieldClassName,
}) => {
    return (
      <div className={className}>
        <Label htmlFor={name} className={`${!label ? 'sr-only' : ''}`}>{label || name}</Label>
        <TextAreaComponent
          defaultValue={defaultValue}
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={fieldClassName}
          {...register(name, { required: requiredFromProps })}
        />

        {requiredFromProps && errors[name] && <Error error={errors[name]} />}
      </div>
    )
  }
