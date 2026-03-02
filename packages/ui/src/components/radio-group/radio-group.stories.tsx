import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { RadioGroup, RadioGroupItem } from './radio-group.js';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup aria-label="Default radio group">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="default-option-a" />
        <Label htmlFor="default-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="default-option-b" />
        <Label htmlFor="default-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="default-option-c" />
        <Label htmlFor="default-option-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <RadioGroup defaultValue="option-b" aria-label="Radio group with default value">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="with-default-option-a" />
        <Label htmlFor="with-default-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="with-default-option-b" />
        <Label htmlFor="with-default-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="with-default-option-c" />
        <Label htmlFor="with-default-option-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled aria-label="Disabled radio group">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="disabled-option-a" />
        <Label htmlFor="disabled-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="disabled-option-b" />
        <Label htmlFor="disabled-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="disabled-option-c" />
        <Label htmlFor="disabled-option-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <RadioGroup aria-label="Radio group with labels">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="labels-option-a" />
        <Label htmlFor="labels-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="labels-option-b" />
        <Label htmlFor="labels-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="labels-option-c" />
        <Label htmlFor="labels-option-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

export const HorizontalLayout: Story = {
  render: () => (
    <RadioGroup className="flex gap-4" aria-label="Horizontal radio group">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="horizontal-option-a" />
        <Label htmlFor="horizontal-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="horizontal-option-b" />
        <Label htmlFor="horizontal-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="horizontal-option-c" />
        <Label htmlFor="horizontal-option-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState('option-a');

  return (
    <RadioGroup value={value} onValueChange={setValue} aria-label="Controlled radio group">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-a" id="controlled-option-a" />
        <Label htmlFor="controlled-option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-b" id="controlled-option-b" />
        <Label htmlFor="controlled-option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-c" id="controlled-option-c" />
        <Label htmlFor="controlled-option-c">Option C</Label>
      </div>
    </RadioGroup>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
