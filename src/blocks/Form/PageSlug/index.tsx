'use client'
import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import canUseDOM from '@/utilities/canUseDOM'

export const PageSlug: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    setValue: UseFormSetValue<FieldValues>
    className?: string
    fieldClassName?: string
    placeholder?: string
  }
> = ({ name, register, setValue }) => {
  useEffect(() => {
    if (canUseDOM) {
      setValue(name, document.location.pathname)
    }
  }, [])
  return <Input defaultValue="" id={name} type="hidden" {...register(name)} />
}
