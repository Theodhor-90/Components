import { cn } from '../../lib/utils.js';
import {
  connectionStatusDotVariants,
  connectionStatusVariants,
} from './connection-status.styles.js';
import type { ConnectionStatusProps } from './connection-status.types.js';

export type { ConnectionStatusProps } from './connection-status.types.js';

const defaultLabels: Record<ConnectionStatusProps['status'], string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
};

export function ConnectionStatus({
  className,
  status,
  children,
  ref,
  ...props
}: ConnectionStatusProps) {
  return (
    <div
      data-slot="connection-status"
      role="status"
      aria-live="polite"
      className={cn(connectionStatusVariants({ status, className }))}
      ref={ref}
      {...props}
    >
      <span
        data-slot="connection-status-dot"
        className={cn(connectionStatusDotVariants({ status }))}
      />
      <span>{children ?? defaultLabels[status]}</span>
    </div>
  );
}
