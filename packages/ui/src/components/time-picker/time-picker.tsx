import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select.js';
import {
  timePickerContentStyles,
  timePickerPlaceholderStyles,
  timePickerSeparatorStyles,
  timePickerTriggerStyles,
} from './time-picker.styles.js';
import type { TimePickerProps } from './time-picker.types.js';

export type { TimePickerProps } from './time-picker.types.js';

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export function TimePicker({
  value,
  defaultValue,
  onChange,
  disabled,
  placeholder,
  className,
  ref,
}: TimePickerProps): React.JSX.Element {
  const [timeValue, setTimeValue] = useControllableState<string | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange,
  });

  const hour = timeValue ? timeValue.split(':')[0] : undefined;
  const minute = timeValue ? timeValue.split(':')[1] : undefined;

  const handleHourChange = (nextHour: string): void => {
    const nextMinute = minute ?? '00';
    setTimeValue(`${nextHour}:${nextMinute}`);
  };

  const handleMinuteChange = (nextMinute: string): void => {
    const nextHour = hour ?? '00';
    setTimeValue(`${nextHour}:${nextMinute}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-slot="time-picker"
          variant="outline"
          className={cn(timePickerTriggerStyles, className)}
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {timeValue ? (
            timeValue
          ) : (
            <span className={timePickerPlaceholderStyles}>{placeholder ?? 'Pick a time'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className={timePickerContentStyles}>
          <Select value={hour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hourOption) => (
                <SelectItem key={hourOption} value={hourOption}>
                  {hourOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className={timePickerSeparatorStyles}>:</span>
          <Select value={minute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minuteOption) => (
                <SelectItem key={minuteOption} value={minuteOption}>
                  {minuteOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
