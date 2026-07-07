import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface PremiumInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  name?: string;
  id?: string;
  className?: string;
  textarea?: boolean;
  rows?: number;
  select?: boolean;
  options?: SelectOption[];
}

/**
 * PremiumInput with subtle shadows, smooth focus states, and integrated icons
 * No harsh borders - uses shadow system for depth
 */
export const PremiumInput = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, PremiumInputProps>(
  ({
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
    ...props
  }, ref) => {
    const inputWrapper = 'relative';
    const inputBase = 'w-full px-4 py-3 rounded-xl outline-none transition-all duration-300';
    const inputStyles = `${inputBase} shadow-premium-sm focus:shadow-premium-md`;
    const inputDisabled = 'opacity-50 cursor-not-allowed';
    const inputError = 'shadow-red-200 focus:shadow-red-300';

    const iconStyles = 'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none';

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className={inputWrapper}>
          {icon && iconPosition === 'left' && !textarea && !select && (
            <div className="left-4 pl-2 iconStyles">{icon}</div>
          )}
          {select ? (
            <select
              ref={ref as React.RefObject<HTMLSelectElement>}
              className={cn(
                inputStyles,
                disabled && inputDisabled,
                error && inputError,
                icon && (iconPosition === 'left' ? 'pl-12' : 'pr-12'),
                className
              )}
              disabled={disabled}
              value={props.value}
              onChange={props.onChange}
              name={props.name}
              id={props.id}
              required={props.required}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : textarea ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              rows={rows}
              className={cn(
                inputStyles,
                disabled && inputDisabled,
                error && inputError,
                icon && 'pl-12',
                className
              )}
              disabled={disabled}
              value={props.value}
              onChange={props.onChange}
              name={props.name}
              id={props.id}
              placeholder={props.placeholder}
              required={props.required}
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              className={cn(
                inputStyles,
                disabled && inputDisabled,
                error && inputError,
                icon && (iconPosition === 'left' ? 'pl-12' : 'pr-12'),
                className
              )}
              disabled={disabled}
              {...props}
            />
          )}
          {icon && iconPosition === 'right' && !textarea && !select && (
            <div className="right-4 pr-2 iconStyles">{icon}</div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

// Premium Textarea component
interface PremiumTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ className = '', label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 shadow-premium-sm focus:shadow-premium-md resize-none',
            error && 'shadow-red-200 focus:shadow-red-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

PremiumTextarea.displayName = 'PremiumTextarea';