export type TimePickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
