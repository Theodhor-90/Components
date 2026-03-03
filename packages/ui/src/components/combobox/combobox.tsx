import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  comboboxCheckHiddenStyles,
  comboboxCheckStyles,
  comboboxContentStyles,
  comboboxPlaceholderStyles,
  comboboxTriggerStyles,
} from './combobox.styles.js';
import type { ComboboxProps } from './combobox.types.js';

export type { ComboboxOption, ComboboxProps } from './combobox.types.js';

export function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  ref,
}: ComboboxProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue);
      }
    },
  });

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="combobox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={selectedOption?.label ?? placeholder ?? 'Select...'}
          className={cn(comboboxTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={comboboxPlaceholderStyles}>{placeholder ?? 'Select...'}</span>
          )}
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
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            aria-hidden="true"
          >
            {open ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={comboboxContentStyles} align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? 'Search...'} />
          <CommandList>
            <CommandEmpty>{emptyMessage ?? 'No results found.'}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    setValue(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
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
                    className={cn(
                      option.value === value ? comboboxCheckStyles : comboboxCheckHiddenStyles,
                    )}
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
