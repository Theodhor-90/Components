import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import type { Slot } from '@radix-ui/react-slot';
import type * as LabelPrimitive from '@radix-ui/react-label';

export type FormFieldContextValue = {
  name: string;
};

export type FormItemContextValue = {
  id: string;
};

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

export type FormItemProps = React.ComponentProps<'div'>;

export type FormLabelProps = React.ComponentProps<typeof LabelPrimitive.Root>;

export type FormControlProps = React.ComponentProps<typeof Slot>;

export type FormDescriptionProps = React.ComponentProps<'p'>;

export type FormMessageProps = React.ComponentProps<'p'>;
