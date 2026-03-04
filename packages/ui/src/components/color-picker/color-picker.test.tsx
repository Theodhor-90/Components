import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ColorPicker } from './color-picker.js';

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

describe('ColorPicker', () => {
  it('renders without crashing', () => {
    render(<ColorPicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders default placeholder when no value', () => {
    render(<ColorPicker />);
    expect(screen.getByText('Pick a color')).toBeInTheDocument();
    expect(screen.getByText('Pick a color')).toHaveClass('text-muted-foreground');
  });

  it('opens popover on trigger click', async () => {
    const user = userEvent.setup();
    render(<ColorPicker />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });
  });

  it('clicking preset swatch sets value', async () => {
    const user = userEvent.setup();
    render(<ColorPicker />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('red'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /#ef4444/i })).toBeInTheDocument();
    });
  });

  it('hex input updates value in real time (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<ColorPicker />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    const hexInput = document.querySelector(
      '[data-slot="popover-content"] input',
    ) as HTMLInputElement;

    await user.clear(hexInput);
    await user.type(hexInput, 'ff0000');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /#ff0000/i })).toBeInTheDocument();
    });

    const previewSwatch = document.querySelector(
      '[data-slot="popover-content"] span[aria-hidden="true"]',
    ) as HTMLElement;
    expect(previewSwatch.style.backgroundColor).toBeTruthy();
  });

  it('hex input rejects invalid characters', async () => {
    const user = userEvent.setup();
    render(<ColorPicker />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    const hexInput = document.querySelector(
      '[data-slot="popover-content"] input',
    ) as HTMLInputElement;

    await user.type(hexInput, 'gg');

    expect(hexInput.value).not.toContain('g');
  });

  it('preview swatch reflects current value', async () => {
    const user = userEvent.setup();
    render(<ColorPicker defaultValue="#3b82f6" />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    const previewSwatch = document.querySelector(
      '[data-slot="popover-content"] span[aria-hidden="true"]',
    ) as HTMLElement;
    expect(previewSwatch.style.backgroundColor).toBeTruthy();
  });

  it('trigger shows selected color swatch and hex text', () => {
    render(<ColorPicker defaultValue="#ef4444" />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('#ef4444');

    const swatch = trigger.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(swatch).toBeInTheDocument();
    expect(swatch.style.backgroundColor).toBeTruthy();
  });

  it('controlled mode works', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorPicker value="#ef4444" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('blue'));

    expect(onValueChange).toHaveBeenCalledWith('#3b82f6');
    const trigger = document.querySelector(
      '[data-slot="color-picker"]',
    ) as HTMLElement;
    expect(trigger).toHaveTextContent('#ef4444');
  });

  it('uncontrolled mode works', () => {
    render(<ColorPicker defaultValue="#3b82f6" />);
    expect(screen.getByRole('button')).toHaveTextContent('#3b82f6');
  });

  it('disabled state prevents opening', async () => {
    const user = userEvent.setup();
    render(<ColorPicker disabled />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(
      document.querySelector('[data-slot="popover-content"]'),
    ).not.toBeInTheDocument();
  });

  it('palette swatches are focusable buttons', async () => {
    const user = userEvent.setup();
    render(<ColorPicker />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-content"]'),
      ).toBeInTheDocument();
    });

    const swatches = document.querySelectorAll(
      '[data-slot="popover-content"] button[aria-label]',
    );
    expect(swatches).toHaveLength(22);
    swatches.forEach((swatch) => {
      expect(swatch.tagName).toBe('BUTTON');
    });
  });

  it('has data-slot attribute', () => {
    render(<ColorPicker />);
    expect(
      document.querySelector('[data-slot="color-picker"]'),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ColorPicker />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
