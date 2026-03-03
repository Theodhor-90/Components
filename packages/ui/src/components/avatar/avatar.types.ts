import type * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { VariantProps } from 'class-variance-authority';

import type { avatarVariants } from './avatar.styles.js';

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

export type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;

export type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>;
