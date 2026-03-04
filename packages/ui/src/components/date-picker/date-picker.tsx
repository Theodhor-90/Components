import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Calendar } from '../calendar/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  datePickerPlaceholderStyles,
  datePickerTriggerStyles,
} from './date-picker.styles.js';
import type { DatePickerProps } from './date-picker.types.js';

export type { DatePickerProps } from './date-picker.types.js';

const defaultFormatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

export function DatePicker({
  date: dateProp,
  defaultDate,
  onDateChange,
  formatDate = defaultFormatDate,
  placeholder = 'Pick a date',
  disabled,
  className,
  ref,
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useControllableState<Date | undefined>({
    prop: dateProp,
    defaultProp: defaultDate,
    onChange: onDateChange,
  });

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected as Date | undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker"
          variant="outline"
          className={cn(datePickerTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          {date ? (
            formatDate(date)
          ) : (
            <span className={datePickerPlaceholderStyles}>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} defaultMonth={date} />
      </PopoverContent>
    </Popover>
  );
}
