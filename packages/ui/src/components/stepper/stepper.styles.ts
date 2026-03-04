import { cva } from 'class-variance-authority';

export const stepperVariants = cva('flex gap-0', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-start',
      vertical: 'flex-col items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const stepperItemVariants = cva(
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      status: {
        pending: 'border-2 border-muted-foreground text-muted-foreground',
        active: 'bg-primary text-primary-foreground',
        completed: 'bg-primary text-primary-foreground',
        error: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  },
);

export const stepperItemTitleStyles = 'text-sm font-medium';

export const stepperItemDescriptionStyles = 'text-xs text-muted-foreground';

export const stepperConnectorCompletedStyles = 'bg-primary';

export const stepperConnectorPendingStyles = 'bg-border';
