import { Card, CardContent } from '@/components/ui/card'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'sm' | 'md' | 'lg' | 'xl' | 'glass'
  hover?: boolean
}

/** @deprecated Use Card from @/components/ui/card */
export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className = '', variant: _variant = 'md', hover = false, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(hover && 'transition-colors hover:bg-muted/30', className)}
        {...props}
      >
        {children}
      </Card>
    )
  }
)

PremiumCard.displayName = 'PremiumCard'

export const PremiumCardContent = CardContent
