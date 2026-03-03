import { DayPicker } from 'react-day-picker';

import { cn } from '../../lib/utils.js';
import {
  calendarButtonNextStyles,
  calendarButtonPreviousStyles,
  calendarCaptionLabelStyles,
  calendarDayButtonStyles,
  calendarDayStyles,
  calendarDisabledStyles,
  calendarFocusedStyles,
  calendarHiddenStyles,
  calendarMonthCaptionStyles,
  calendarMonthGridStyles,
  calendarMonthStyles,
  calendarMonthsStyles,
  calendarNavStyles,
  calendarOutsideStyles,
  calendarRangeEndStyles,
  calendarRangeMiddleStyles,
  calendarRangeStartStyles,
  calendarRootStyles,
  calendarSelectedStyles,
  calendarTodayStyles,
  calendarWeekdayStyles,
  calendarWeekdaysStyles,
  calendarWeekStyles,
} from './calendar.styles.js';
import type { CalendarProps } from './calendar.types.js';

export type { CalendarProps } from './calendar.types.js';

export function Calendar({
  className,
  classNames,
  components,
  ...props
}: CalendarProps): React.JSX.Element {
  return (
    <DayPicker
      data-slot="calendar"
      className={cn(calendarRootStyles, className)}
      classNames={{
        months: calendarMonthsStyles,
        month: calendarMonthStyles,
        month_caption: calendarMonthCaptionStyles,
        caption_label: calendarCaptionLabelStyles,
        nav: calendarNavStyles,
        button_previous: calendarButtonPreviousStyles,
        button_next: calendarButtonNextStyles,
        month_grid: calendarMonthGridStyles,
        weekdays: calendarWeekdaysStyles,
        weekday: calendarWeekdayStyles,
        week: calendarWeekStyles,
        day: calendarDayStyles,
        day_button: calendarDayButtonStyles,
        selected: calendarSelectedStyles,
        today: calendarTodayStyles,
        outside: calendarOutsideStyles,
        disabled: calendarDisabledStyles,
        range_start: calendarRangeStartStyles,
        range_end: calendarRangeEndStyles,
        range_middle: calendarRangeMiddleStyles,
        hidden: calendarHiddenStyles,
        focused: calendarFocusedStyles,
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
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
            {orientation === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
          </svg>
        ),
        ...components,
      }}
      {...props}
    />
  );
}
