import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<FieldValues>
    setValue: any
    className?: string
    fieldClassName?: string
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  className,
  fieldClassName,
}) => {
    const props = register(name, { required: requiredFromProps })
    const { setValue } = useFormContext()

    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <CheckboxUi
            defaultChecked={defaultValue}
            id={name}
            className={fieldClassName}
            {...props}
            onCheckedChange={(checked) => {
              setValue(props.name, checked)
            }}
          />
          <Label htmlFor={name} className={`${!label ? 'sr-only' : ''}`}>{label || name}</Label>
        </div>
        {requiredFromProps && errors[name] && <Error error={errors[name]} />}
      </div>
    )
  }
