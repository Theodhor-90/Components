import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '../../lib/utils.js';
import { avatarFallbackStyles, avatarImageStyles, avatarVariants } from './avatar.styles.js';
import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './avatar.types.js';

export type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './avatar.types.js';

export function Avatar({ className, size, ref, ...props }: AvatarProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function AvatarImage({ className, ref, ...props }: AvatarImageProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ref,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
