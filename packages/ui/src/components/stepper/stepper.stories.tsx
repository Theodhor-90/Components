import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stepper, StepperItem } from './stepper.js';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="completed" title="Account" />
      <StepperItem status="completed" title="Profile" />
      <StepperItem status="active" title="Review" />
      <StepperItem status="pending" title="Complete" />
    </Stepper>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <Stepper {...args} orientation="vertical">
      <StepperItem status="completed" title="Account" />
      <StepperItem status="completed" title="Profile" />
      <StepperItem status="active" title="Review" />
      <StepperItem status="pending" title="Complete" />
    </Stepper>
  ),
};

export const AllStatuses: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="pending" title="Pending" />
      <StepperItem status="active" title="Active" />
      <StepperItem status="completed" title="Completed" />
      <StepperItem status="error" title="Error" />
    </Stepper>
  ),
};

export const WithDescriptions: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="completed" title="Account" description="Create your account" />
      <StepperItem status="active" title="Profile" description="Fill in your details" />
      <StepperItem status="pending" title="Review" description="Review and submit" />
    </Stepper>
  ),
};

export const ThreeStepProgress: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="completed" title="Account Setup" />
      <StepperItem status="completed" title="Profile Details" />
      <StepperItem status="active" title="Verification" />
      <StepperItem status="pending" title="Complete" />
    </Stepper>
  ),
};

export const SingleStep: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="active" title="Only Step" />
    </Stepper>
  ),
};

export const ErrorState: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem status="completed" title="Payment" />
      <StepperItem status="completed" title="Shipping" />
      <StepperItem status="error" title="Confirmation" />
      <StepperItem status="pending" title="Done" />
    </Stepper>
  ),
};
