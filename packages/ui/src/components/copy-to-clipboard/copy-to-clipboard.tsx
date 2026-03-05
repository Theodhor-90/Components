import { useEffect, useRef, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { copyToClipboardStyles } from './copy-to-clipboard.styles.js';
import type { CopyToClipboardProps } from './copy-to-clipboard.types.js';

export type { CopyToClipboardProps } from './copy-to-clipboard.types.js';

export function CopyToClipboard({
  className,
  text,
  asChild = false,
  onClick,
  children,
  ref,
  ...props
}: CopyToClipboardProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);

    onClick?.(event);
  };

  const Comp = asChild ? Slot : 'button';

  const icon = copied ? (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  return (
    <Comp
      data-slot="copy-to-clipboard"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={cn(copyToClipboardStyles, className)}
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {asChild ? children : icon}
    </Comp>
  );
}
