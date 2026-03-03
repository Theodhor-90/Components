import { useRef } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { inputVariants } from '../input/input.styles.js';
import {
  searchInputClearStyles,
  searchInputContainerStyles,
  searchInputFieldStyles,
  searchInputIconStyles,
} from './search-input.styles.js';
import type { SearchInputProps } from './search-input.types.js';

export type { SearchInputProps } from './search-input.types.js';

export function SearchInput({
  className,
  value: valueProp,
  defaultValue,
  onChange,
  onSearch,
  onClear,
  onKeyDown,
  disabled,
  ref,
  ...props
}: SearchInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value ?? '');
    }

    onKeyDown?.(e);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();

    const input = inputRef.current ?? (ref && 'current' in ref ? ref.current : null);
    input?.focus();
  };

  const setRef = (node: HTMLInputElement | null) => {
    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  };

  return (
    <div data-slot="search-input" className={cn(searchInputContainerStyles, className)}>
      <svg
        className={searchInputIconStyles}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      <input
        ref={setRef}
        data-slot="search-input-field"
        type="search"
        className={cn(inputVariants(), searchInputFieldStyles)}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      />

      {value && value.length > 0 && (
        <button
          type="button"
          className={searchInputClearStyles}
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear search"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
