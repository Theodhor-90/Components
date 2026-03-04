import { useCallback, useState } from 'react';
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
  mode = 'single',
  value: valueProp,
  defaultValue,
  onValueChange,
  onCreateOption,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  ref,
}: ComboboxProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const normalizedProp =
    mode === 'multiple'
      ? (valueProp as string[] | undefined)
      : valueProp !== undefined
        ? [valueProp as string]
        : undefined;

  const normalizedDefault =
    mode === 'multiple'
      ? (defaultValue as string[] | undefined)
      : defaultValue !== undefined
        ? [defaultValue as string]
        : undefined;

  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    prop: normalizedProp,
    defaultProp: normalizedDefault ?? [],
    onChange: (next) => {
      if (mode === 'multiple') {
        (onValueChange as ((v: string[]) => void) | undefined)?.(next);
      } else {
        (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '');
      }
    },
  });

  const values = selectedValues ?? [];

  const handleSelect = (optionValue: string) => {
    if (mode === 'multiple') {
      const next = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      setSelectedValues(next);
    } else {
      setSelectedValues([optionValue]);
      setOpen(false);
    }
  };

  const triggerContent = (() => {
    if (values.length === 0) {
      return <span className={comboboxPlaceholderStyles}>{placeholder ?? 'Select...'}</span>;
    }
    if (mode === 'multiple' && values.length > 1) {
      return `${values.length} selected`;
    }
    const option = options.find((o) => o.value === values[0]);
    return option?.label ?? values[0];
  })();

  const showCreateOption =
    onCreateOption !== undefined &&
    searchValue.trim() !== '' &&
    !options.some((o) => o.label.toLowerCase() === searchValue.trim().toLowerCase());

  const triggerLabel =
    values.length === 0
      ? (placeholder ?? 'Select...')
      : mode === 'multiple' && values.length > 1
        ? `${values.length} selected`
        : (options.find((o) => o.value === values[0])?.label ?? values[0]);

  const commandFilter = useCallback(
    (value: string, search: string, keywords?: string[]) => {
      if (value === '__create__') return 1;
      const extendedValue = keywords?.length ? `${value} ${keywords.join(' ')}` : value;
      if (extendedValue.toLowerCase().includes(search.toLowerCase())) return 1;
      return 0;
    },
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="combobox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={triggerLabel}
          className={cn(comboboxTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
          {triggerContent}
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
        <Command filter={commandFilter}>
          <CommandInput
            placeholder={searchPlaceholder ?? 'Search...'}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage ?? 'No results found.'}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
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
                      values.includes(option.value)
                        ? comboboxCheckStyles
                        : comboboxCheckHiddenStyles,
                    )}
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </CommandItem>
              ))}
            </CommandGroup>
            {showCreateOption && (
              <CommandGroup>
                <CommandItem
                  value="__create__"
                  onSelect={() => {
                    onCreateOption(searchValue.trim());
                    setSearchValue('');
                  }}
                >
                  Create {searchValue.trim()}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
