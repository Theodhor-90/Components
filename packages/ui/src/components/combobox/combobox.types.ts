export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxBaseProps = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  onCreateOption?: (value: string) => void;
};

type ComboboxSingleProps = ComboboxBaseProps & {
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  mode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
