import type { VariantProps } from 'class-variance-authority';

import type { spinnerVariants } from './spinner.styles.js';

export type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>;
