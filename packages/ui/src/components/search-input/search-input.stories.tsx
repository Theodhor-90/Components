import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchInput } from './search-input.js';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search...', 'aria-label': 'Search' },
};

export const WithValue: Story = {
  args: { defaultValue: 'React components', 'aria-label': 'Search' },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to search..."
        aria-label="Controlled search"
      />
    );
  },
};

export const WithSearchHandler: Story = {
  args: {
    placeholder: 'Press Enter to search...',
    onSearch: (value: string) => console.log('Searched:', value),
    'aria-label': 'Search with handler',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot search', 'aria-label': 'Disabled search' },
};
