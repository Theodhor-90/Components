import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  colorPickerContentStyles,
  colorPickerHashStyles,
  colorPickerHexInputStyles,
  colorPickerInputWrapperStyles,
  colorPickerPaletteStyles,
  colorPickerPlaceholderStyles,
  colorPickerPreviewStyles,
  colorPickerSwatchActiveStyles,
  colorPickerSwatchStyles,
  colorPickerTriggerStyles,
  colorPickerTriggerSwatchStyles,
} from './color-picker.styles.js';
import type { ColorPickerProps } from './color-picker.types.js';

export type { ColorPickerProps } from './color-picker.types.js';

const PALETTE_COLORS = [
  { name: 'slate', hex: '#64748b' },
  { name: 'gray', hex: '#6b7280' },
  { name: 'zinc', hex: '#71717a' },
  { name: 'neutral', hex: '#737373' },
  { name: 'stone', hex: '#78716c' },
  { name: 'red', hex: '#ef4444' },
  { name: 'orange', hex: '#f97316' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'green', hex: '#22c55e' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'fuchsia', hex: '#d946ef' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'rose', hex: '#f43f5e' },
] as const;

const HEX_REGEX = /^[0-9a-fA-F]{0,6}$/;

export function ColorPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  className,
  ref,
}: ColorPickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [color, setColor] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const hexWithoutHash = color ? color.replace('#', '') : '';

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (HEX_REGEX.test(raw)) {
      setColor(`#${raw}`);
    }
  };

  const handleSwatchClick = (hex: string) => {
    setColor(hex);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="color-picker"
          variant="outline"
          className={cn(colorPickerTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
          {color ? (
            <>
              <span
                className={colorPickerTriggerSwatchStyles}
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              {color}
            </>
          ) : (
            <span className={colorPickerPlaceholderStyles}>
              {placeholder ?? 'Pick a color'}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={colorPickerContentStyles} align="start">
        <div className={colorPickerPaletteStyles}>
          {PALETTE_COLORS.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              className={
                color === swatch.hex
                  ? colorPickerSwatchActiveStyles
                  : colorPickerSwatchStyles
              }
              style={{ backgroundColor: swatch.hex }}
              aria-label={swatch.name}
              onClick={() => handleSwatchClick(swatch.hex)}
            />
          ))}
        </div>
        <div className={colorPickerInputWrapperStyles}>
          <span className={colorPickerHashStyles}>#</span>
          <Input
            className={colorPickerHexInputStyles}
            value={hexWithoutHash}
            onChange={handleHexChange}
            maxLength={6}
            placeholder="000000"
          />
          <span
            className={colorPickerPreviewStyles}
            style={{ backgroundColor: color ?? 'transparent' }}
            aria-hidden="true"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
