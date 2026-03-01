export const toasterThemeConfig = {
  toastOptions: {
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    classNames: {
      toast: 'group border-border',
      description: 'text-muted-foreground',
      actionButton: 'bg-primary text-primary-foreground',
      cancelButton: 'bg-muted text-muted-foreground',
    },
  },
} as const;
