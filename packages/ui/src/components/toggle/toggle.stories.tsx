import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './toggle.js';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    'aria-label': 'Bold',
    children: 'Bold',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    'aria-label': 'Outline toggle',
    children: 'Bold',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    'aria-label': 'Small toggle',
    children: 'Bold',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    'aria-label': 'Large toggle',
    children: 'Bold',
  },
};

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    'aria-label': 'Pressed toggle',
    children: 'Bold',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled toggle',
    children: 'Bold',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
      >
        <path
          d="M3 2.5h4.5a2.5 2.5 0 010 5H3v-5Zm0 5h5a2.75 2.75 0 010 5.5H3V7.5Z"
          fill="currentColor"
        />
      </svg>
    </Toggle>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [pressed, setPressed] = useState<boolean>(false);

  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Controlled toggle">
      Bold
    </Toggle>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
