import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Label } from '../label/label.js';
import { Slider } from './slider.js';

describe('Slider', () => {
  it('renders without crashing', () => {
    render(<Slider aria-label="Test" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Slider aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    expect(thumb.closest('[data-slot="slider"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Slider aria-label="Test" className="custom-class" />);
    const thumb = screen.getByRole('slider');
    expect(thumb.closest('[data-slot="slider"]')).toHaveClass('custom-class');
  });

  it('renders single thumb for single value', () => {
    render(<Slider defaultValue={[50]} aria-label="Test" />);
    expect(screen.getAllByRole('slider')).toHaveLength(1);
  });

  it('renders two thumbs for range mode', () => {
    render(<Slider defaultValue={[25, 75]} aria-label="Test" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('thumb has correct ARIA value attributes', () => {
    render(<Slider defaultValue={[50]} aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  it('supports custom min, max, step', () => {
    render(<Slider min={10} max={50} step={5} defaultValue={[20]} aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuemin', '10');
    expect(thumb).toHaveAttribute('aria-valuemax', '50');
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('disabled state', () => {
    render(<Slider disabled defaultValue={[50]} aria-label="Test" />);
    const root = screen.getByRole('slider').closest('[data-slot="slider"]');
    expect(root).toHaveAttribute('data-disabled');
  });

  it('controlled usage', () => {
    const onValueChange = vi.fn();
    render(<Slider value={[30]} onValueChange={onValueChange} aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
  });

  it('uncontrolled usage', () => {
    render(<Slider defaultValue={[40]} aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('adjusts value on arrow key press', async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={[50]} step={1} aria-label="Test" />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Slider ref={ref} aria-label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no a11y violations (single)', async () => {
    const { container } = render(<Slider defaultValue={[50]} aria-label="Slider" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (range)', async () => {
    const { container } = render(<Slider defaultValue={[25, 75]} aria-label="Range" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (with label)', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="slider-test">Volume</Label>
        <Slider id="slider-test" defaultValue={[50]} aria-label="Volume" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
