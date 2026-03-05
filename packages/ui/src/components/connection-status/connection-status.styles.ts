import { cva } from 'class-variance-authority';

export const connectionStatusVariants = cva(
  'inline-flex items-center gap-2 text-sm',
  {
    variants: {
      status: {
        connected: '',
        connecting: '',
        disconnected: '',
      },
    },
    defaultVariants: {
      status: 'connected',
    },
  },
);

export const connectionStatusDotVariants = cva(
  'size-2 rounded-full shrink-0',
  {
    variants: {
      status: {
        connected: 'bg-green-500 dark:bg-green-400',
        connecting: 'bg-yellow-500 dark:bg-yellow-400 animate-pulse',
        disconnected: 'bg-red-500 dark:bg-red-400',
      },
    },
    defaultVariants: {
      status: 'connected',
    },
  },
);
