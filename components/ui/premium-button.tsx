import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
}

/**
 * PremiumButton with smooth animations, loading states, and premium styling
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    gradient = true,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'font-medium rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2';

    const variants = {
      primary: gradient
        ? 'text-white shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300'
        : 'text-white bg-red-600 hover:bg-red-700 shadow-premium-sm hover:shadow-premium-md',
      secondary: 'text-gray-900 bg-white shadow-premium-sm hover:shadow-premium-md hover:bg-gray-50',
      outline: 'text-gray-900 shadow-premium-sm hover:shadow-premium-md bg-white border-0',
      ghost: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      danger: 'text-white bg-red-600 hover:bg-red-700 shadow-premium-sm hover:shadow-premium-md',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    };

    const gradientStyle = variant === 'primary' && gradient
      ? { background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }
      : {};

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        style={gradientStyle}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';