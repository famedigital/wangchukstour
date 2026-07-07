import { Card, CardContent } from './card';
import { forwardRef, HTMLAttributes } from 'react';

interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'sm' | 'md' | 'lg' | 'xl' | 'glass';
  hover?: boolean;
}

/**
 * PremiumCard component with elevated shadow system and smooth transitions
 *
 * @variant Controls the shadow intensity (sm, md, lg, xl, glass)
 * @hover Adds hover effect with enhanced shadow
 */
export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className = '', variant = 'md', hover = true, children, ...props }, ref) => {
    const shadowClasses = {
      sm: 'shadow-premium-sm',
      md: 'shadow-premium-md',
      lg: 'shadow-premium-lg',
      xl: 'shadow-premium-xl',
      glass: 'shadow-glass backdrop-blur-sm bg-white/90',
    };

    const hoverClasses = hover ? 'hover:shadow-premium-lg transition-shadow duration-300' : '';

    return (
      <Card
        ref={ref}
        className={`${shadowClasses[variant]} ${hoverClasses} ${className}`}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

export const PremiumCardContent = CardContent;