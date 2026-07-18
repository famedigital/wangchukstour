'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-6xl max-h-[90vh] overflow-y-auto',
}

/** @deprecated Use Dialog from @/components/ui/dialog */
export function PremiumModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: PremiumModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn('w-full', sizeClasses[size])}
      >
        {(title || showCloseButton) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
          </DialogHeader>
        )}
        <div className={cn(size === 'full' && 'max-h-[calc(90vh-5rem)] overflow-y-auto')}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function ModalFooter({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mt-6 flex items-center justify-end gap-2 border-t pt-4', className)}>
      {children}
    </div>
  )
}
