import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback, AvatarImage } from './avatar.js';

describe('Avatar', () => {
  it('renders fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders image element', () => {
    render(
      <Avatar>
        <AvatarImage src="/photo.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const image = screen.getByRole('img', { name: 'User' });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/photo.jpg');
    expect(image).toHaveAttribute('alt', 'User');
  });

  it('shows fallback when no AvatarImage present', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('Avatar has data-slot="avatar"', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it('AvatarImage has data-slot="avatar-image"', () => {
    render(
      <Avatar>
        <AvatarImage src="/photo.jpg" alt="User" />
      </Avatar>,
    );

    expect(screen.getByRole('img', { name: 'User' })).toHaveAttribute('data-slot', 'avatar-image');
  });

  it('AvatarFallback has data-slot="avatar-fallback"', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText('JD')).toHaveAttribute('data-slot', 'avatar-fallback');
  });

  it('Avatar merges custom className', () => {
    const { container } = render(
      <Avatar className="custom-class">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const avatar = container.querySelector('[data-slot="avatar"]');

    expect(avatar).toHaveClass('custom-class');
    expect(avatar).toHaveClass('overflow-hidden');
    expect(avatar).toHaveClass('rounded-full');
  });

  it('AvatarImage merges custom className', () => {
    render(
      <Avatar>
        <AvatarImage className="custom-img" src="/photo.jpg" alt="User" />
      </Avatar>,
    );

    const image = screen.getByRole('img', { name: 'User' });

    expect(image).toHaveClass('custom-img');
    expect(image).toHaveClass('aspect-square');
  });

  it('AvatarFallback merges custom className', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fb">JD</AvatarFallback>
      </Avatar>,
    );

    const fallback = screen.getByText('JD');

    expect(fallback).toHaveClass('custom-fb');
    expect(fallback).toHaveClass('bg-muted');
  });

  it('applies sm size classes', () => {
    const { container } = render(
      <Avatar size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const avatar = container.querySelector('[data-slot="avatar"]');

    expect(avatar).toHaveClass('h-8');
    expect(avatar).toHaveClass('w-8');
  });

  it('applies default md size classes', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const avatar = container.querySelector('[data-slot="avatar"]');

    expect(avatar).toHaveClass('h-10');
    expect(avatar).toHaveClass('w-10');
  });

  it('applies lg size classes', () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const avatar = container.querySelector('[data-slot="avatar"]');

    expect(avatar).toHaveClass('h-12');
    expect(avatar).toHaveClass('w-12');
  });

  it('forwards ref to root element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Avatar ref={ref}>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveAttribute('data-slot', 'avatar');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
