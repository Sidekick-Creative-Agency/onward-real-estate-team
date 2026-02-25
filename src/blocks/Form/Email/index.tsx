import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    className?: string
    fieldClassName?: string
    placeholder?: string
    hidden?: boolean
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  placeholder,
  className,
  fieldClassName,
  hidden,
}) => {
    return (
      <div className={className}>
        <Label htmlFor={name} className={`${!label ? 'sr-only' : ''}`}>{label || name}</Label>
        <Input
          defaultValue={defaultValue}
          id={name}
          type={hidden ? 'hidden' : 'email'}
          placeholder={placeholder}
          className={fieldClassName}
          {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error error={errors[name]} />}
      </div>
    )
  }
