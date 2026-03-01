import { buttonVariants } from '../button/button.styles.js';

export const alertDialogOverlayStyles =
  'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

export const alertDialogContentStyles =
  'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg';

export const alertDialogHeaderStyles = 'flex flex-col space-y-1.5 text-center sm:text-left';

export const alertDialogFooterStyles =
  'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';

export const alertDialogTitleStyles = 'text-lg font-semibold leading-none tracking-tight';

export const alertDialogDescriptionStyles = 'text-sm text-muted-foreground';

export const alertDialogActionStyles = buttonVariants();

export const alertDialogCancelStyles = `${buttonVariants({ variant: 'outline' })} mt-2 sm:mt-0`;
