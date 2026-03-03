import type { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  className?: string;
};
