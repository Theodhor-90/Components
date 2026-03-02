import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '../input/input.js';
import { Checkbox } from '../checkbox/checkbox.js';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form.js';

function TestForm({
  schema,
  defaultValues,
  children,
  onSubmit = () => {},
}: {
  schema: z.ZodType;
  defaultValues: Record<string, unknown>;
  children: React.ReactNode;
  onSubmit?: (values: unknown) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

const nameSchema = z.object({ name: z.string() });
const minSchema = z.object({
  name: z.string().min(2, { message: 'Must be at least 2 characters.' }),
});

describe('Form', () => {
  it('renders without crashing', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('FormItem applies data-slot="form-item"', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(document.querySelector('[data-slot="form-item"]')).toBeInTheDocument();
  });

  it('FormLabel htmlFor links to control', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByLabelText('Name')).toBe(screen.getByRole('textbox'));
  });

  it('FormControl aria-describedby includes description id', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter name</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    const input = screen.getByRole('textbox');
    const description = screen.getByText('Enter name');
    expect(input.getAttribute('aria-describedby')).toContain(description.id);
  });

  it('FormDescription id matches aria-describedby', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter name</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    const input = screen.getByRole('textbox');
    const description = screen.getByText('Enter name');
    expect(description).toHaveAttribute('data-slot', 'form-description');
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
  });

  it('FormMessage renders nothing when no error', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(document.querySelector('[data-slot="form-message"]')).not.toBeInTheDocument();
  });

  it('displays validation error on submit', async () => {
    const user = userEvent.setup();
    render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Must be at least 2 characters.')).toBeInTheDocument();
    });
  });

  it('FormMessage has aria-live="polite"', async () => {
    const user = userEvent.setup();
    render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const message = document.querySelector('[data-slot="form-message"]');
      expect(message).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('FormLabel applies text-destructive on error', async () => {
    const user = userEvent.setup();
    render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const label = document.querySelector('[data-slot="form-label"]');
      expect(label).toHaveClass('text-destructive');
    });
  });

  it('FormControl applies aria-invalid on error', async () => {
    const user = userEvent.setup();
    render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('aria-describedby includes both description and message IDs on error', async () => {
    const user = userEvent.setup();
    render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const input = screen.getByRole('textbox');
      const description = screen.getByText('Enter name');
      const message = document.querySelector('[data-slot="form-message"]');
      expect(input.getAttribute('aria-describedby')).toContain(description.id);
      expect(input.getAttribute('aria-describedby')).toContain(message!.id);
    });
  });

  it('FormMessage displays children when no error', () => {
    render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>Custom message</FormMessage>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('integrates with Input — error shows and clears', async () => {
    const user = userEvent.setup();
    const emailSchema = z.object({ email: z.string().email({ message: 'Invalid email.' }) });
    render(
      <TestForm schema={emailSchema} defaultValues={{ email: '' }}>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Invalid email.')).toBeInTheDocument();
    });
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.queryByText('Invalid email.')).not.toBeInTheDocument();
    });
  });

  it('integrates with Checkbox', () => {
    const boolSchema = z.object({ accept: z.boolean() });
    render(
      <TestForm schema={boolSchema} defaultValues={{ accept: false }}>
        <FormField
          name="accept"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Accept terms</FormLabel>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('validates multiple fields independently', async () => {
    const user = userEvent.setup();
    const multiSchema = z.object({
      first: z.string().min(1, { message: 'First required.' }),
      second: z.string().min(1, { message: 'Second required.' }),
    });
    render(
      <TestForm schema={multiSchema} defaultValues={{ first: 'valid', second: '' }}>
        <FormField
          name="first"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="second"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Second</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Second required.')).toBeInTheDocument();
      expect(screen.queryByText('First required.')).not.toBeInTheDocument();
    });
  });

  it('passes axe accessibility check without errors', async () => {
    const { container } = render(
      <TestForm schema={nameSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your name</FormDescription>
            </FormItem>
          )}
        />
      </TestForm>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes axe accessibility check with validation errors', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TestForm schema={minSchema} defaultValues={{ name: '' }}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TestForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Must be at least 2 characters.')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
