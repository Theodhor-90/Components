import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeBlock } from './code-block.js';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: { control: 'text' },
    showLineNumbers: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const multiLineCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

const longLineCode =
  'const result = someReallyLongFunctionName(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix, argumentSeven, argumentEight);';

export const Default: Story = {
  args: { children: 'const x = 42;' },
};

export const WithLanguageLabel: Story = {
  args: {
    children: 'const x: number = 42;\nconsole.log(x);',
    language: 'typescript',
  },
};

export const WithLineNumbers: Story = {
  args: { children: multiLineCode, showLineNumbers: true },
};

export const WithLineNumbersAndLanguage: Story = {
  args: { children: multiLineCode, showLineNumbers: true, language: 'javascript' },
};

export const LongContent: Story = {
  args: { children: longLineCode },
};

export const EmptyContent: Story = {
  args: { children: '' },
};
