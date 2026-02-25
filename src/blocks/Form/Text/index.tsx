import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'

export const Text: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    className?: string
    fieldClassName?: string
    width?: string
    placeholder?: string
  }
> = ({
  name,
  defaultValue,
  placeholder,
  errors,
  label,
  register,
  required: requiredFromProps,
  className,
  fieldClassName,
}) => {
    return (
      <div className={className}>
        <Label htmlFor={name} className={`${!label ? 'sr-only' : ''}`}>{label || name}</Label>
        <Input
          defaultValue={defaultValue}
          id={name}
          type="text"
          placeholder={placeholder}
          className={fieldClassName}
          {...register(name, { required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error error={errors[name]} />}
      </div>
    )
  }
