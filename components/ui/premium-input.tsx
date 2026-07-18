'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface SelectOption {
  value: string
  label: string
}

interface PremiumInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  placeholder?: string
  required?: boolean
  type?: string
  name?: string
  id?: string
  className?: string
  textarea?: boolean
  rows?: number
  select?: boolean
  options?: SelectOption[]
}

/** @deprecated Use Label + Input/Textarea/Select from @/components/ui */
export const PremiumInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  PremiumInputProps
>(
  (
    {
      className = '',
      label,
      error,
      icon,
      iconPosition = 'left',
      disabled,
      textarea = false,
      rows = 4,
      select = false,
      options = [],
      id,
      ...props
    },
    ref
  ) => {
    const fieldId = id || props.name

    return (
      <div className="grid gap-2">
        {label && (
          <Label htmlFor={fieldId} className={error ? 'text-destructive' : undefined}>
            {label}
            {props.required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && !textarea && !select && (
            <div className="pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {icon}
            </div>
          )}
          {select ? (
            <select
              ref={ref as React.RefObject<HTMLSelectElement>}
              id={fieldId}
              disabled={disabled}
              value={props.value}
              onChange={props.onChange}
              name={props.name}
              required={props.required}
              aria-invalid={!!error}
              className={cn(
                'flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                className
              )}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : textarea ? (
            <Textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              id={fieldId}
              rows={rows}
              disabled={disabled}
              aria-invalid={!!error}
              className={cn(className)}
              value={props.value}
              onChange={props.onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
              name={props.name}
              placeholder={props.placeholder}
              required={props.required}
            />
          ) : (
            <Input
              ref={ref as React.RefObject<HTMLInputElement>}
              id={fieldId}
              type={props.type || 'text'}
              disabled={disabled}
              aria-invalid={!!error}
              className={cn(icon && iconPosition === 'left' && 'pl-8', className)}
              value={props.value}
              onChange={props.onChange as React.ChangeEventHandler<HTMLInputElement>}
              name={props.name}
              placeholder={props.placeholder}
              required={props.required}
            />
          )}
          {icon && iconPosition === 'right' && !textarea && !select && (
            <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)

PremiumInput.displayName = 'PremiumInput'

interface PremiumTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

/** @deprecated Use Label + Textarea from @/components/ui */
export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const fieldId = id || props.name
    return (
      <div className="grid gap-2">
        {label && (
          <Label htmlFor={fieldId} className={error ? 'text-destructive' : undefined}>
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={className}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)

PremiumTextarea.displayName = 'PremiumTextarea'
