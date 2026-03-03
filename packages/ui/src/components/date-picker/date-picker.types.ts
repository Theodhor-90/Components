export type DatePickerProps = {
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  formatDate?: (date: Date) => string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
