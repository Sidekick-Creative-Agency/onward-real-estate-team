'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { TeamMember } from '@/payload-types'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import canUseDOM from '@/utilities/canUseDOM'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'

export const TeamMemberContactFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email(),
  phone: z
    .string()
    .min(7, { message: 'Phone number too short' })
    .max(14, { message: 'Phone number too long' })
    .regex(
      new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      'Invalid phone number',
    )
    .optional(),
  message: z.string(),
  teamMemberEmail: z.string().email(),
})

interface ContactFormProps {
  teamMember: TeamMember
}

export const ContactForm: React.FC<ContactFormProps> = ({ teamMember }) => {
  const form = useForm<z.infer<typeof TeamMemberContactFormSchema>>({
    resolver: zodResolver(TeamMemberContactFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()

  const onSubmit = (data) => {
    const submitForm = async () => {
      setError(undefined)
      setIsLoading(true)
      const dataToSend = Object.entries(data).map(([name, value]) => ({
        field: name,
        value,
      }))

      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/form-submissions`,
          {
            body: JSON.stringify({
              form: 4,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )

        const res = await req.json()

        if (req.status >= 400) {
          setIsLoading(false)

          setError({
            message: res.errors?.[0]?.message || 'Internal Server Error',
            status: res.status,
          })

          return
        }

        setIsLoading(false)
        setHasSubmitted(true)
      } catch (err) {
        console.warn(err)
        setIsLoading(false)
        setError({
          message: 'Something went wrong.',
        })
      }
    }

    void submitForm()
  }

  useEffect(() => {
    if (canUseDOM) {
    }
  }, [form])

  if (!form) return
  if (!hasSubmitted) {
    return (
      <Form {...form}>
        <form
          className="grid max-[400px]:grid-cols-1 grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="firstName"
            defaultValue=""
            render={({ field }) => {
              return (
                <FormItem
                  className={`w-full col-span-1 relative transition-[margin-bottom] ${form.formState.errors[field.name] ? 'mb-8' : 'mb-0'}`}
                >
                  <FormControl>
                    <Input
                      placeholder="First Name*"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="lastName"
            defaultValue=""
            render={({ field }) => {
              return (
                <FormItem
                  className={`w-full col-span-1  relative transition-[margin-bottom] ${form.formState.errors[field.name] ? 'mb-8' : 'mb-0'}`}
                >
                  <FormControl>
                    <Input
                      placeholder="Last Name*"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="phone"
            defaultValue=""
            render={({ field }) => {
              return (
                <FormItem
                  className={`w-full col-span-1 relative transition-[margin-bottom] ${form.formState.errors[field.name] ? 'mb-6' : 'mb-0'}`}
                >
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => {
              return (
                <FormItem
                  className={`w-full col-span-1 relative transition-[margin-bottom] ${form.formState.errors[field.name] ? 'mb-6' : 'mb-0'}`}
                >
                  <FormControl>
                    <Input
                      placeholder="Email Address*"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="message"
            defaultValue=""
            render={({ field }) => {
              return (
                <FormItem
                  className={`w-full max-[400px]:col-span-1 col-span-2 sm:col-span-1 md:col-span-2 relative transition-[margin-bottom] ${form.formState.errors[field.name] ? 'mb-6' : 'mb-0'}`}
                >
                  <FormControl>
                    <Textarea
                      placeholder="Comments"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="teamMemberEmail"
            defaultValue={teamMember.details.email || ''}
            render={({ field }) => {
              return (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      placeholder="Email Address*"
                      type="hidden"
                      {...field}
                      className="text-sm font-light text-brand-gray-06 py-4 px-6 bg-white"
                    />
                  </FormControl>
                  {form.formState.errors[field.name] && (
                    <FormMessage className="absolute left-0 top-[calc(100%+.5rem)] font-light">
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )
            }}
          />
          <div>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-brand-navy px-8 mt-4 min-w-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="w-4 h-auto text-white animate-spin"
                />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </Form>
    )
  }

  if (hasSubmitted) {
    return (
      <div>
        <h3 className="text-2xl text-brand-gray-06 font-bold">Thanks for reaching out!</h3>
        <p className="text-brand-gray-04 font-light">
          Someone from our team will be in touch with you soon.
        </p>
      </div>
    )
  }
}
