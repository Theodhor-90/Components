import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback } from '../avatar/avatar.js';
import { AvatarGroup } from './avatar-group.js';

function createAvatarChildren(count: number): React.JSX.Element[] {
  return Array.from({ length: count }, (_, index) => {
    const label = `A${index + 1}`;

    return (
      <Avatar key={label}>
        <AvatarFallback>{label}</AvatarFallback>
      </Avatar>
    );
  });
}

describe('AvatarGroup', () => {
  it('renders multiple avatars', () => {
    render(<AvatarGroup>{createAvatarChildren(3)}</AvatarGroup>);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
  });

  it('renders all avatars when no max prop', () => {
    render(<AvatarGroup>{createAvatarChildren(5)}</AvatarGroup>);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.getByText('A4')).toBeInTheDocument();
    expect(screen.getByText('A5')).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('limits visible avatars to max and shows overflow', () => {
    render(<AvatarGroup max={3}>{createAvatarChildren(5)}</AvatarGroup>);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.queryByText('A4')).not.toBeInTheDocument();
    expect(screen.queryByText('A5')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('overflow indicator displays correct count', () => {
    render(<AvatarGroup max={4}>{createAvatarChildren(10)}</AvatarGroup>);

    expect(screen.getByText('+6')).toBeInTheDocument();
  });

  it('does not show overflow when max is greater than or equal to children count', () => {
    render(<AvatarGroup max={5}>{createAvatarChildren(3)}</AvatarGroup>);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('first child has the highest z-index', () => {
    const { container } = render(<AvatarGroup>{createAvatarChildren(3)}</AvatarGroup>);

    const root = container.querySelector('[data-slot="avatar-group"]');
    const wrappers = Array.from(root?.children ?? []) as HTMLDivElement[];

    expect(wrappers).toHaveLength(3);
    expect(wrappers[0]?.style.zIndex).toBe('3');
    expect(wrappers[1]?.style.zIndex).toBe('2');
    expect(wrappers[2]?.style.zIndex).toBe('1');
  });

  it('has data-slot="avatar-group"', () => {
    const { container } = render(<AvatarGroup>{createAvatarChildren(1)}</AvatarGroup>);

    expect(container.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <AvatarGroup className="custom-class">{createAvatarChildren(1)}</AvatarGroup>,
    );

    const root = container.querySelector('[data-slot="avatar-group"]');

    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('flex');
    expect(root).toHaveClass('items-center');
  });

  it('forwards ref to root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<AvatarGroup ref={ref}>{createAvatarChildren(1)}</AvatarGroup>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'avatar-group');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AvatarGroup>{createAvatarChildren(3)}</AvatarGroup>);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
