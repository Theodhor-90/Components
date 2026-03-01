import { Toaster as SonnerToaster, toast } from 'sonner';

import { toasterThemeConfig } from './sonner.styles.js';
import type { ToasterProps } from './sonner.types.js';

export type { ToasterProps } from './sonner.types.js';

export { toast };

export function Toaster({ theme, ...props }: ToasterProps): React.JSX.Element {
  const resolvedTheme =
    theme ??
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light');

  return (
    <SonnerToaster data-slot="sonner" theme={resolvedTheme} {...toasterThemeConfig} {...props} />
  );
}
