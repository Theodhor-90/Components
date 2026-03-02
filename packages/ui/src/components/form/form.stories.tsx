import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '../button/button.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { Input } from '../input/input.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/select.js';
import { Slider } from '../slider/slider.js';
import { Switch } from '../switch/switch.js';
import { Textarea } from '../textarea/textarea.js';
import { Label } from '../label/label.js';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form.js';

const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function SimpleTextFieldDemo() {
  const schema = z.object({
    username: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const SimpleTextField: Story = {
  render: () => <SimpleTextFieldDemo />,
};

function WithValidationErrorDemo() {
  const schema = z.object({
    username: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  });
  useEffect(() => {
    form.trigger();
  }, [form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithValidationError: Story = {
  render: () => <WithValidationErrorDemo />,
};

function WithTextareaDemo() {
  const schema = z.object({
    bio: z.string().max(200, { message: 'Max 200 characters.' }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { bio: '' },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormDescription>Max 200 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithTextarea: Story = {
  render: () => <WithTextareaDemo />,
};

function WithCheckboxDemo() {
  const schema = z.object({
    terms: z.boolean().refine((v) => v, { message: 'You must accept.' }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithCheckbox: Story = {
  render: () => <WithCheckboxDemo />,
};

function WithSelectDemo() {
  const schema = z.object({
    fruit: z.enum(['apple', 'banana', 'cherry'], { message: 'Please select a fruit.' }),
  });
  const form = useForm<{ fruit: string }>({
    resolver: zodResolver(schema),
    defaultValues: { fruit: '' },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="fruit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite fruit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="cherry">Cherry</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose your favorite fruit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithSelect: Story = {
  render: () => <WithSelectDemo />,
};

function WithRadioGroupDemo() {
  const schema = z.object({
    theme: z.enum(['light', 'dark', 'system'], { message: 'Please select a theme.' }),
  });
  const form = useForm<{ theme: string }>({
    resolver: zodResolver(schema),
    defaultValues: { theme: '' },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Theme preference</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="light" />
                    </FormControl>
                    <Label>Light</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="dark" />
                    </FormControl>
                    <Label>Dark</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="system" />
                    </FormControl>
                    <Label>System</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithRadioGroup: Story = {
  render: () => <WithRadioGroupDemo />,
};

function WithSwitchDemo() {
  const schema = z.object({
    marketing: z.boolean(),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { marketing: false },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Marketing emails</FormLabel>
                <FormDescription>Receive emails about new products and features.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithSwitch: Story = {
  render: () => <WithSwitchDemo />,
};

function WithSliderDemo() {
  const schema = z.object({
    volume: z.array(z.number().min(0).max(100)),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { volume: [50] },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Adjust the volume level.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithSlider: Story = {
  render: () => <WithSliderDemo />,
};

function CompleteFormDemo() {
  const schema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    bio: z.string().max(200, { message: 'Bio must be at most 200 characters.' }).optional(),
    role: z.enum(['admin', 'editor', 'viewer'], { message: 'Please select a role.' }),
    terms: z.boolean().refine((v) => v, { message: 'You must accept the terms.' }),
  });
  const form = useForm<{
    name: string;
    email: string;
    bio: string;
    role: string;
    terms: boolean;
  }>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      role: '',
      terms: false,
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>Your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormDescription>Max 200 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Your role in the organization.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const CompleteForm: Story = {
  render: () => <CompleteFormDemo />,
};
