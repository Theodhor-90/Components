import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from './combobox.js';
import type { ComboboxOption } from './combobox.types.js';

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const manyOptions: ComboboxOption[] = Array.from({ length: 60 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

function ControlledCombobox(): React.JSX.Element {
  const [value, setValue] = useState<string | undefined>('apple');

  return <Combobox options={options} value={value} onValueChange={setValue} />;
}

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: {
    options,
  },
};

export const WithDefaultValue: Story = {
  args: {
    options,
    defaultValue: 'banana',
  },
};

export const Controlled: Story = {
  render: () => <ControlledCombobox />,
};

export const Disabled: Story = {
  args: {
    options,
    disabled: true,
  },
};

export const ManyOptions: Story = {
  args: {
    options: manyOptions,
  },
};
