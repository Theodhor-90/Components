export type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
