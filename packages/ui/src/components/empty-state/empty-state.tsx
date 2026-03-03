import { cn } from '../../lib/utils.js';
import {
  emptyStateActionStyles,
  emptyStateDescriptionStyles,
  emptyStateIconStyles,
  emptyStateStyles,
  emptyStateTitleStyles,
} from './empty-state.styles.js';
import type { EmptyStateProps } from './empty-state.types.js';

export type { EmptyStateProps } from './empty-state.types.js';

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ref,
  ...props
}: EmptyStateProps): React.JSX.Element {
  return (
    <div data-slot="empty-state" className={cn(emptyStateStyles, className)} ref={ref} {...props}>
      {icon && (
        <div data-slot="empty-state-icon" className={emptyStateIconStyles}>
          {icon}
        </div>
      )}
      <h3 data-slot="empty-state-title" className={emptyStateTitleStyles}>
        {title}
      </h3>
      {description && (
        <p data-slot="empty-state-description" className={emptyStateDescriptionStyles}>
          {description}
        </p>
      )}
      {action && (
        <div data-slot="empty-state-action" className={emptyStateActionStyles}>
          {action}
        </div>
      )}
    </div>
  );
}
