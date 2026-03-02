import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { textareaVariants } from './textarea.styles.js';
import type { TextareaProps } from './textarea.types.js';

export type { TextareaProps } from './textarea.types.js';

export function Textarea({
  className,
  asChild = false,
  autoResize = false,
  style,
  ref,
  ...props
}: TextareaProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'textarea';

  return (
    <Comp
      data-slot="textarea"
      className={cn(textareaVariants({ className }))}
      style={autoResize ? ({ fieldSizing: 'content', ...style } as React.CSSProperties) : style}
      ref={ref}
      {...props}
    />
  );
}
