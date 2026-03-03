export type SearchInputProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
};
