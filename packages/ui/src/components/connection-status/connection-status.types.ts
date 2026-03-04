import type { VariantProps } from 'class-variance-authority';
import type { connectionStatusDotVariants } from './connection-status.styles.js';

export type ConnectionStatusProps = React.ComponentProps<'div'> &
  VariantProps<typeof connectionStatusDotVariants> & {
    status: 'connected' | 'connecting' | 'disconnected';
  };
