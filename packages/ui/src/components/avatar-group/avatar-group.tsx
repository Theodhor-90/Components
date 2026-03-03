import { Children } from 'react';

import { cn } from '../../lib/utils.js';
import { avatarGroupOverflowStyles, avatarGroupStyles } from './avatar-group.styles.js';
import type { AvatarGroupProps } from './avatar-group.types.js';

export type { AvatarGroupProps } from './avatar-group.types.js';

export function AvatarGroup({
  className,
  children,
  max,
  ref,
  ...props
}: AvatarGroupProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const total = childArray.length;
  const visible = max !== undefined && max < total ? childArray.slice(0, max) : childArray;
  const overflowCount = max !== undefined && max < total ? total - max : 0;

  return (
    <div data-slot="avatar-group" className={cn(avatarGroupStyles, className)} ref={ref} {...props}>
      {visible.map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: total - index }}>
          {child}
        </div>
      ))}
      {overflowCount > 0 && (
        <div className={avatarGroupOverflowStyles} style={{ zIndex: 0 }}>
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
