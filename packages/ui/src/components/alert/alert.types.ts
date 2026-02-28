import type { VariantProps } from 'class-variance-authority';

import type { alertVariants } from './alert.styles.js';

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

export type AlertTitleProps = React.ComponentProps<'h5'>;

export type AlertDescriptionProps = React.ComponentProps<'div'>;
