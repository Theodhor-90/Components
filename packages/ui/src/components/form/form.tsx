import { createContext, useContext, useId } from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { Label } from '../label/label.js';
import { formDescriptionVariants, formItemVariants, formMessageVariants } from './form.styles.js';
import type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldContextValue,
  FormFieldProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
} from './form.types.js';

export type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
} from './form.types.js';

const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

const FormItemContext = createContext<FormItemContextValue | undefined>(undefined);

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  if (!fieldContext) {
    throw new Error('useFormField must be used within a <FormField>');
  }
  if (!itemContext) {
    throw new Error('useFormField must be used within a <FormItem>');
  }
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: FormFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
}

export function FormItem({ className, ref, ...props }: FormItemProps) {
  const id = useId();
  return (
    <FormItemContext value={{ id }}>
      <div
        data-slot="form-item"
        className={cn(formItemVariants({ className }))}
        ref={ref}
        {...props}
      />
    </FormItemContext>
  );
}

export function FormLabel({ className, ref, ...props }: FormLabelProps) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      ref={ref}
      {...props}
    />
  );
}

export function FormControl({ ref, ...props }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      ref={ref}
      {...props}
    />
  );
}

export function FormDescription({ className, ref, ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn(formDescriptionVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}

export function FormMessage({ className, children, ref, ...props }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) {
    return null;
  }
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn(formMessageVariants({ className }))}
      aria-live="polite"
      ref={ref}
      {...props}
    >
      {body}
    </p>
  );
}
