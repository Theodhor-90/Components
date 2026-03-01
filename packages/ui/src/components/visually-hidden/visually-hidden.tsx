import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

import type { VisuallyHiddenProps } from './visually-hidden.types.js';

export type { VisuallyHiddenProps } from './visually-hidden.types.js';

export function VisuallyHidden({ ref, ...props }: VisuallyHiddenProps): React.JSX.Element {
  return <VisuallyHiddenPrimitive.Root data-slot="visually-hidden" ref={ref} {...props} />;
}
